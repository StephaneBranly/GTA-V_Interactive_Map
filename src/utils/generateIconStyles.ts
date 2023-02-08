import { MAP_ICONS } from "constants/mapIcons";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";

export const generateIconStyles = () => {
    const styles: Record<string, Style> = {};
    for (const [key, value] of Object.entries(MAP_ICONS)) {
        styles[key] = new Style({
            image: new Icon({
                src: value.src,
                scale: value.scale,
                anchor: value.anchor,
            }),
        });
    }
    return styles;
}