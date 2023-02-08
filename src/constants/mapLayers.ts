export const AVAILABLE_LAYERS = {
    'vector-light' : {
        'name' : 'Vector Light',
        'url'  : './maps/vector_map_light.svg',
        'extent': [0, 0, 1000, 1200],
        'size': [1000, 1200],
    },
    'vector-dark' : {
        'name' : 'Vector Dark',
        'url'  : './maps/vector_map_dark.svg',
        'extent': [0, 0, 1000, 1200],
        'size': [1000, 1200],
    },
    'satellite' : {
        'name' : 'Satellite',
        'url'  : './maps/satellite_map.png',
        'extent': [-125, 70, 1093 , 1285],
        'size': [2048, 2048],
    }
};

export const DEFAULT_LAYER = 'vector-dark';
export const MAP_EXTENT = [0, 0, 1000, 1200];
