import VectorSource from 'ol/source/Vector';
import * as React from 'react';

export interface FeatureControlProps {
    label: string,
    count: number,
    iconSrc: string,
    markersSource: VectorSource,
}

const FeatureControl = (props: FeatureControlProps) => {
    const [visible, setVisible] = React.useState(true);

    const toggleVisibility = () => {
        setVisible(!visible);
        props.markersSource.getFeatures().forEach((feature) => {
            if (feature.get('label') === props.label) {
                feature.set('visible', !visible)
            }
        });
    };

    const handlerHover = (hovered: boolean) => {
        props.markersSource.getFeatures().forEach((feature) => {
            if (feature.get('label') === props.label) {
                feature.set('hovered', hovered)
            }
        });
    };

    return <div className={`features-control-label ${visible?'visible':'hidden'}`} onMouseEnter={() => handlerHover(true)} onMouseLeave={() => handlerHover(false)} key={props.label}>
        <span>{props.label}</span>
        <span className='count'>{props.count}</span>
        <img src={props.iconSrc} alt={'icon'} className={'icon'}  onClick={toggleVisibility} />
    </div>
};

export { FeatureControl };
