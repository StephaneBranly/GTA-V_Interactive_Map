import { AVAILABLE_LAYERS, DEFAULT_LAYER } from "constants/mapLayers";

import ImageLayer from "ol/layer/Image";
import { ProjectionLike } from "ol/proj";
import Static from "ol/source/ImageStatic";

export const generateMapLayers = (projection: ProjectionLike) => {
    const layers = [];
    for (const [key, value] of Object.entries(AVAILABLE_LAYERS)) {
        layers.push(new ImageLayer({
            source: new Static({
                url: value.url,
                projection: projection,
                imageExtent: value.extent,
                imageSize: value.size,
            }),
            visible: key === DEFAULT_LAYER,
            properties: {
                name: value.name,
                id: key
            }
        }));
    }
    return layers;
}