import { Map } from 'ol'
import { Control } from 'ol/control'
import { useEffect, useRef } from 'react'

export interface CoordsControlProps {
    mapRef: React.MutableRefObject<Map | undefined> 
    coords: string,
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

    return <div id='coords' className='coords' ref={ref}>
        {props.coords}
    </div>
}

export default CoordsControl