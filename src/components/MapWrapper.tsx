import 'ol/ol.css';

import { useEffect, useRef, useState } from 'react';

import { DEFAULT_LAYER } from 'constants/mapLayers';

import { Feature, Overlay } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import { Point } from 'ol/geom';
import Style, { StyleFunction } from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { FeatureLike } from 'ol/Feature';


import { coordToString } from 'utils/coordsToString';
import { generateMapLayers } from 'utils/generateMapLayers';
import { generateProjection } from 'utils/generateProjection';
import { generateIconStyles } from 'utils/generateIconStyles';
import { generateDefaultView } from 'utils/generateDefaultView';

import CoordsControl from './controls/CoordsControl';
import LoadFileControl from './controls/LoadFileControl';
import SwitchLayerControl from './controls/SwitchLayerControl';
import ZoomControl from './controls/ZoomControl';

const MapWrapper = () => {
  const styles = generateIconStyles()

  const renderStyle: StyleFunction = (feature: FeatureLike) => {
    const styleToRender = feature.get('label').toLowerCase();
    return styles[styleToRender] || styles['default'];
  };

  const mapRef = useRef<Map>()
  const [ source, setSource ] = useState<VectorSource>(new VectorSource())
  const [ featuresLayer, setFeaturesLayer ] = useState<VectorLayer<VectorSource>>(new VectorLayer({
    source: source,
    style: new Style({
      image: new Icon({
        src: './map-icons/current_position.svg',
        scale: 0.07,
        anchor: [0.5, 0.5],
      }),
    }),
  }))

  const [markersSource, setMarkersSource] = useState<VectorSource>(new VectorSource())
  const [markersLayer, setMarkersLayer] = useState<VectorLayer<VectorSource>>(new VectorLayer({
    source: markersSource,
    style: renderStyle
  }))

  const [currentCoords, setCurrentCoords] = useState<string>('');
  const mapElement = useRef<HTMLDivElement>(null);
  const tooltipElement = useRef<HTMLDivElement>(null);

  const [activeLayer, setActiveLayer] = useState<string>(DEFAULT_LAYER);

  const [content, setContent] = useState<string>('');

  useEffect( () => {
    if (!mapElement.current || mapRef.current) return
    if (!tooltipElement.current) return

    const newOverlay  = new Overlay({
      element: tooltipElement.current as HTMLElement,
      autoPan: true,
      stopEvent: false,
      positioning: 'bottom-center',
    });

    const projection = generateProjection();
    mapRef.current = new Map({
      target: mapElement.current,
      layers: [
        ...generateMapLayers(projection),
        featuresLayer,
        markersLayer,
      ],
      view: generateDefaultView(projection),
      overlays: [newOverlay],
      controls: [],
    })

    
    mapRef.current.on('click',evt=>{
      const newCoords = coordToString(evt.coordinate);
      source.clear();
      const feature = new Feature({
        geometry: new Point(evt.coordinate),
        label: 'Current',
      });

      source.addFeature(feature);
      navigator.clipboard.writeText(newCoords)
    });

    mapRef.current.on('pointermove',evt=>{
      const newCoords = `Coordinate is ${coordToString(evt.coordinate)}`;
      setCurrentCoords(newCoords);

      let newContent = '';
      mapRef.current?.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (layer === markersLayer) {
          const description = feature.get('description');
          if (description) {
            newContent = description;
            newOverlay?.setPosition(evt.coordinate);
          }
        }
      });
      setContent(newContent);
      if (!newContent) {
        newOverlay?.setPosition(undefined);
      }
    });
  },[mapElement, mapRef, tooltipElement])

    return (
      <div ref={mapElement} className={`map-wrapper bg-${activeLayer}`} >
        <div id="tooltip" className="tooltip" ref={tooltipElement}>
          {content}
        </div>
        <ZoomControl mapRef={mapRef} />
        <SwitchLayerControl mapRef={mapRef} activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
        <LoadFileControl mapRef={mapRef} markersSource={markersSource} />
        <CoordsControl mapRef={mapRef} coords={currentCoords}  /> 
      </div>
    )
  };

export { MapWrapper };