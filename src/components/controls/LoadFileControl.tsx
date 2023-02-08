import { Map } from 'ol'
import { Control } from 'ol/control'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'
import { generateFeaturesFromCSV } from 'utils/generateFeaturesFromCSV'
import { readFile } from 'utils/readFile'

export interface LoadFileControlProps {
    mapRef: React.MutableRefObject<Map | undefined>,
    markersSource: VectorSource
}

const LoadFileControl = (props: LoadFileControlProps) => {
    const ref = useRef(null)
  const fileInput = useRef<HTMLInputElement>(null)
    
    useEffect(() => {
        if (!ref.current) return
        if (!props.mapRef.current) return
        const control = new Control({
            element: ref.current as HTMLElement,
          });
      
        props.mapRef.current?.addControl(control)
    }, [])

    const handlerLoadFile = (e: any) => {
        const file = e.target.files[0]
        if (!file) return
    
        readFile(file).then((text) => {
          const newFeatures = generateFeaturesFromCSV(text)
          props.markersSource.clear()
          props.markersSource.addFeatures(newFeatures)
        })
      }
    
      const handlerButtonLoadFile = () => {
        if (!fileInput.current) return
        fileInput.current.click();
      }

    return <div id="load-data" className="load-data ol-control" ref={ref}>
        <input type="file" id="file" ref={fileInput} onChange={handlerLoadFile} style={{display: 'none'}} />
        <button onClick={handlerButtonLoadFile}>
            <svg fill="#fff" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-line-cap="round" stroke-line-join="round"></g><g id="SVGRepo_iconCarrier"> <title>file</title> <path d="M20.938 4.031h-13.938v23.938h10v-2h-8v-19.938h10v3h4v11h2v-12.062l-4.062-3.938zM23 22.031h-2v2h-2v2h2v1.938h2v-2h2v-1.938h-2v-2z"></path> </g></svg>
        </button>
  </div>
}

export default LoadFileControl