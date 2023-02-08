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

        const hoverStyle = new Style({
            image: new Icon({
                src: value.src,
                scale: value.scale * 1.2,
                anchor: value.anchor,
            }),
            zIndex: 100,
        });
        styles[key + "_hover"] = hoverStyle;
    }
    return styles;
}