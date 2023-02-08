export const coordToString = (coord: number[]) => {
    if (!coord) return '';
    return `${coord.map(c => Math.round(c))}`;
}