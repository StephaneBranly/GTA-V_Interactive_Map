import { Feature } from "ol";
import { Point } from "ol/geom";

export const generateFeaturesFromCSV = (csv: string) => {
    const features: Feature[] = []
    const rows = csv.split("\n")
    rows.forEach(row => {
        if (!row) return
        const [x, y, style, description] = row.split(',');
        const feature = new Feature({
          geometry: new Point([Number(x), Number(y)]),
        });
        feature.setProperties({
          label: style,
          description: description,
        });
        features.push(feature);
      });
    return features
}