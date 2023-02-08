import { Projection } from "ol/proj";

export const generateProjection = () => {
    return new Projection({
        code: 'xkcd-image',
        units: 'pixels',
        extent: [0, 0, 1000, 1200]
    });
}