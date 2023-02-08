import { Map } from 'ol'
import { Control } from 'ol/control'
import { useEffect, useRef } from 'react'

export interface CoordsControlProps {
    mapRef: React.MutableRefObject<Map | undefined> 
}

const CoordsControl = (props: CoordsControlProps) => {
    const ref = useRef(null)
    
    useEffect(() => {
        if (!ref.current) return
        if (!props.mapRef.current) return
        const control = new Control({
            element: ref.current as HTMLElement,
          });
      
        props.mapRef.current?.addControl(control)
    }, [])

    const handlerZoom = (zoom: 'in' | 'out') => {
        if (!props.mapRef.current) return
        const view = props.mapRef.current.getView()
        const currentZoom = view.getZoom()
        if (!currentZoom) return
        if (zoom === 'in') {
            view.setZoom(currentZoom + 1)
        } else {
            view.setZoom(currentZoom - 1)
        }
    }

    return <div id='zoom' className='zoom ol-control' ref={ref}>
        <button className='zoom__button zoom__button--in' onClick={() => handlerZoom('in')}>
            +
        </button>
        <button className='zoom__button zoom__button--out' onClick={() => handlerZoom('out')}>
            -
        </button>
    </div>
}

export default CoordsControl