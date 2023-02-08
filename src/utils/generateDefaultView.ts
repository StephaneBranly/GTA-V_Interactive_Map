import { View } from "ol"
import { getCenter } from "ol/extent"
import { Projection } from "ol/proj"

export const generateDefaultView = (projection: Projection) => {
    return new View({
        projection: projection,
        center: getCenter(projection.getExtent()),
        zoom: 2,
        maxZoom: 8,
        rotation: 0,
    })
}