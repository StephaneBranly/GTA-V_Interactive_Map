import { MAP_ICONS } from 'constants/mapIcons'
import { Map } from 'ol'
import { Control } from 'ol/control'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'
import { FeatureControl } from './FeatureControl'

export interface FeaturesControlProps {
    mapRef: React.MutableRefObject<Map | undefined>,
    markersSource: VectorSource,
}

const FeaturesControl = (props: FeaturesControlProps) => {
    const ref = useRef(null)
    
    useEffect(() => {
        if (!ref.current) return
        if (!props.mapRef.current) return
        const control = new Control({
            element: ref.current as HTMLElement,
          });
      
        props.mapRef.current?.addControl(control)
    }, [])

    const renderFeatureTypes = () => {
        const labels = props.markersSource.getFeatures().map((feature) => feature.get('label'))
        const counts = labels.reduce((acc, label) => {
            acc[label] = (acc[label] || 0) + 1
            return acc
        }, {} as {[key: string]: number})

        const uniqueLabels = labels.filter((label, index) => labels.indexOf(label) === index)
        return uniqueLabels.map((label: string, key) => {
            const lowerLabel = label.toLowerCase()
            type ObjectKey = keyof typeof MAP_ICONS;
            const iconSrc = Object.keys(MAP_ICONS).includes(lowerLabel) ? MAP_ICONS[lowerLabel as ObjectKey].src : MAP_ICONS['default'].src
            return <FeatureControl label={label} count={counts[label]} iconSrc={iconSrc} markersSource={props.markersSource} key={key} />
        })
    }

    return <div id="features-control" className="features-control ol-control" ref={ref}>
        {renderFeatureTypes()}
  </div>
}

export default FeaturesControl