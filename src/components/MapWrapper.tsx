import 'ol/ol.css';

import { useEffect, useRef, useState } from 'react';

import { Feature, Overlay, View } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Static from 'ol/source/ImageStatic'
import Map from 'ol/Map';
import ImageLayer from 'ol/layer/Image';
import { Projection } from 'ol/proj';
import { getCenter } from 'ol/extent';

import { Geometry, Point } from 'ol/geom';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style, { StyleFunction } from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import {Control, defaults as defaultControls} from 'ol/control';
import Icon from 'ol/style/Icon';
import { FeatureLike } from 'ol/Feature';
import { AVAILABLE_LAYERS } from '../constants/available_layers';

const MapWrapper = () => {
  const styles: Record<string, Style> = {
    'Card': new Style({
      image: new Icon({
        src: './map-icons/card.svg',
        scale: 0.07,
        anchor: [0.5, 0.5],
      }),
    }),
    'Cinema': new Style({
      image: new Icon({
        src: './map-icons/cinema.svg',
        scale: 0.07,
        anchor: [0.5, 0.5],
      }),
    }),
    'Figurine': new Style({
      image: new Icon({
        src: './map-icons/figurine.svg',
        scale: 0.07,
        anchor: [0.5, 0.5],
      }),
    }),
    'Packet': new Style({
      image: new Icon({
        src: './map-icons/packet.svg',
        scale: 0.07,
        anchor: [0.5, 0.5],
      }),
    }),
    'Default': new Style({
      image: new Icon({
        src: './map-icons/default_pin.svg',
        scale: 0.07,
        anchor: [0.5, 1],
      }),
    }),
  };

  const renderStyle: StyleFunction = (feature: FeatureLike) => {
    const style = feature.get('label');
    return styles[style] || styles['Default'];
  };

  // set intial state - used to track references to OpenLayers 
  //  objects for use in hooks, event handlers, etc.
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

  const [ selectedCoord , setSelectedCoord ] = useState<number[]>();
  const [ moving, setMoving ] = useState<boolean>(false);
  const [currentCoords, setCurrentCoords] = useState<string>('');
  // get ref to div element - OpenLayers will render into this div
  const mapElement = useRef<HTMLDivElement>(null);
  const tooltipElement = useRef<HTMLDivElement>(null);
  const switchViewControlElement = useRef<HTMLDivElement>(null);
  const loadDataControlElement = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [overlay, setOverlay] = useState<Overlay>();

  const [activeLayer, setActiveLayer] = useState<string>(Object.keys(AVAILABLE_LAYERS)[0]);

  const [content, setContent] = useState<string>('');

  const extent = [0, 0, 1000, 1200];
  // const imageextent = [0, 0, 2024, 3036];

  const projection = new Projection({
    code: 'xkcd-image',
    units: 'pixels',
    extent: extent,  });


  const coordToString = (coord: number[]) => {
    if (!coord) return '';
    return `${coord.map(c => Math.round(c))}`;
  }

  useEffect( () => {
    if (!mapElement.current || mapRef.current) return
    if (!tooltipElement.current) return
    if (!switchViewControlElement.current) return
    if (!loadDataControlElement.current) return

    const newOverlay  = new Overlay({
      element: tooltipElement.current as HTMLElement,
      autoPan: true,
      stopEvent: false,
      positioning: 'bottom-center',
    });
    
    const switchViewControl = new Control({
      element: switchViewControlElement.current as HTMLElement,
    });

    const loadDataControl = new Control({
      element: loadDataControlElement.current as HTMLElement,
    });

    const controls = defaultControls().extend([
      switchViewControl,
      loadDataControl,
    ])

    mapRef.current = new Map({
      target: mapElement.current,
      layers: [
        new ImageLayer({
          source: new Static({
            attributions: '© branlyst',
            url: './maps/vector_map_light.svg',
            projection: projection,
            imageExtent: extent,
          }),
          visible: true
        }),
        new ImageLayer({
          source: new Static({
            attributions: '© branlyst',
            url: './maps/vector_map_dark.svg',
            projection: projection,
            imageExtent: extent,
          }),
          visible: false
        }),
        new ImageLayer({
          source: new Static({
            attributions: '© branlyst',
            url: './maps/satellite_map.png',
            projection: projection,
            imageExtent: [-125, 70, 1093 , 1285],
            imageSize: [2048, 2048],
          }),
          visible: false
        }),
        featuresLayer,
        markersLayer,
      ],
      view: new View({
        projection: projection,
        center: getCenter(extent),
        zoom: 2,
        maxZoom: 8,
        rotation: 0,
      }),
      overlays: [newOverlay],
      controls: controls,
    })

    setOverlay(newOverlay);

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

    mapRef.current.on('movestart',evt=>{
       setMoving(true);
      }
    );

    mapRef.current.on('moveend',evt=>{
        setMoving(false);
      }
    );

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
        mapRef.current!.getViewport().style.cursor = 'crosshair';
      } else {
        mapRef.current!.getViewport().style.cursor = 'none';
      }
    });
  },[mapElement, mapRef, tooltipElement])

  const handlerSwitchView = () => {
    if (!mapRef.current) return
    const layers = mapRef.current.getLayers();
    const keys = Object.keys(AVAILABLE_LAYERS);
    const newActiveLayer = keys[(keys.indexOf(activeLayer) + 1) % keys.length];
    setActiveLayer(newActiveLayer);

    keys.forEach((key, index) => {
      const layer = layers.getArray()[index];
      layer.setVisible(newActiveLayer === key);
    }
    );
  }

  const handlerLoadFile = (e: any) => {
    if (!mapRef.current) return
    const file = e.target.files[0];



    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (!text) return
      
      const newFeatures: Feature<Geometry>[] = []
      const lines = text.toString().split('\n');
      lines.forEach(line => {
        if (!line) return
        const [x, y, style, description] = line.split(',');
        const feature = new Feature({
          geometry: new Point([Number(x), Number(y)]),
        });
        feature.setProperties({
          label: style,
          description: description,
        });
        newFeatures.push(feature);
      });
    
      markersSource.clear();
      markersSource.addFeatures(newFeatures);
    };

    reader.readAsText(file);
  }

  const handlerButtonLoadFile = () => {
    if (!fileInput.current) return
    fileInput.current.click();
  }

  
    return (
      <div ref={mapElement} className={`map-wrapper ${moving ? 'moving' : ''} bg-${activeLayer}`} >
        <div id="switch-view" className="switch-view ol-control" ref={switchViewControlElement}>
          <button onClick={handlerSwitchView}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#fff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M20.83 3.078l3.051 18.105a13.093 13.093 0 0 0-5.423-1.017c-5.242 0-6.792 1.634-12.034 1.634A13.093 13.093 0 0 1 1 20.783L2.879 9.879l.866.866-1.621 9.405a13.727 13.727 0 0 0 4.3.65 22.054 22.054 0 0 0 5.783-.79 24.03 24.03 0 0 1 6.25-.844 16.25 16.25 0 0 1 4.158.52l-2.674-15.87a11.86 11.86 0 0 0-3.63-.615 7.791 7.791 0 0 0-3.49.725c-.26.106-.529.216-.821.321V3.178a9.538 9.538 0 0 1 4.31-.978 12.674 12.674 0 0 1 4.52.878zM12 11V5h7v13H6v-7zm-5 6h2.382a1.9 1.9 0 0 1 .669-1.215 1.314 1.314 0 0 0 .246-.275 1.058 1.058 0 0 0-.052-.21 1.43 1.43 0 0 1-.08-.572 1.499 1.499 0 0 1 .735-1.097l.144-.09c.123-.073.244-.136.354-.193a2.509 2.509 0 0 0 .26-.146l.342-.326V12H7zm5 0v-2.841c-.047.025-.09.05-.142.076-.094.05-.198.103-.3.163l-.11.07c-.239.156-.28.263-.289.355a.33.33 0 0 0 .02.11 1.507 1.507 0 0 1 .1.763 1.562 1.562 0 0 1-.482.758 1.258 1.258 0 0 0-.392.546zm6 0v-2.95a3.406 3.406 0 0 0-1.067.458A2.75 2.75 0 0 1 15.5 15a4.35 4.35 0 0 1-2.5-.768V17zm-5-6h5V6h-5zm0 1v.92A3.324 3.324 0 0 0 15.5 14a1.9 1.9 0 0 0 .93-.357 4.185 4.185 0 0 1 1.57-.597V12zm-2-2H4V3h7zM9.516 4.15A1.897 1.897 0 0 1 9.814 4H5v3.66a.516.516 0 0 0 .34-.028c.411-.188.643-.96.743-1.288a1.418 1.418 0 0 1 1.241-.923 1.692 1.692 0 0 1 .791.047.732.732 0 0 0 .276.042c.11-.007.215-.178.374-.457a2.397 2.397 0 0 1 .75-.904zM10 9V5.048a1.839 1.839 0 0 0-.366.499 1.516 1.516 0 0 1-1.18.96 1.815 1.815 0 0 1-.593-.071.687.687 0 0 0-.354-.032c-.193.036-.43.105-.467.229A2.915 2.915 0 0 1 5.756 8.54a1.474 1.474 0 0 1-.62.135c-.044 0-.091-.013-.136-.016V9z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>
          </button>
        </div>
        <div id="load-data" className="load-data ol-control" ref={loadDataControlElement}>
          <input type="file" id="file" ref={fileInput} onChange={handlerLoadFile} style={{display: 'none'}} />
          <button onClick={handlerButtonLoadFile}>
            <svg fill="#fff" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>file</title> <path d="M20.938 4.031h-13.938v23.938h10v-2h-8v-19.938h10v3h4v11h2v-12.062l-4.062-3.938zM23 22.031h-2v2h-2v2h2v1.938h2v-2h2v-1.938h-2v-2z"></path> </g></svg>
          </button>
        </div>
        <div id="tooltip" className="tooltip" ref={tooltipElement}>
          {content}
        </div>
        <div id='coords' className='coords'>
          {currentCoords}
        </div>
      </div>
    )
  };

export { MapWrapper };