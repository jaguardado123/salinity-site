// OpenLayers Layer Types
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileWMS from 'ol/source/TileWMS';

// Base Map sources
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';

// GeoJson and feature loading strategy
import GeoJson from 'ol/format/GeoJSON';
import { bbox } from 'ol/loadingstrategy';

import { Style, Fill, Icon, Stroke } from 'ol/style';
import { scale } from 'ol/coordinate';

// Open Street Maps layer.
export const osmMap = new TileLayer({
    title: 'OSM',
    type: 'base',
    visible: true,
    source: new OSM()
});

// Satellite Map layer.
export const satelliteMap = new TileLayer({
    title: 'Satellite',
    type: 'base',
    visible: false,
    source: new XYZ({
        url: 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=Eq7ZrzQDMg5FqaGiQjRm',
        maxZoom: 20
    })
});

// TCEQ Gage Site markers layer.
export const station_coordinates = new VectorLayer({
    title: "Station Coordinates<br/><a href='/gagestations/TCEQ.jpg' download>Download JPG</a>",
    visible: true,
    source: new VectorSource({
        strategy: bbox
    }),
    style: new Style({
        image: new Icon({
            src: '/images/tceq-marker.png',
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: 0.5
        })
    })
});

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const gradient = context.createLinearGradient(0, 0, 1024, 0);
gradient.addColorStop(0, 'red');
gradient.addColorStop(1, 'yellow');

export const c736 = new VectorLayer({
    title: 'C736',
    source: new VectorSource({
        format: new GeoJson(),
        url: '/geojson/layers/c736.geojson',
        startegy: bbox
    }),
    style: new Style({
        stroke: new Stroke({
            color: gradient,
            width: 6
        }),
    })
});

export const c767 = new VectorLayer({
    title: 'C767',
    source: new VectorSource({
        format: new GeoJson(),
        url: '/geojson/layers/c767.geojson',
        startegy: bbox
    }),
    style: new Style({
        stroke: new Stroke({
            color: gradient,
            width: 6
        }),
    })
});

export const c789 = new VectorLayer({
    title: 'C789',
    source: new VectorSource({
        format: new GeoJson(),
        url: '/geojson/layers/c789.geojson',
        startegy: bbox
    }),
    style: new Style({
        stroke: new Stroke({
            color: gradient,
            width: 6
        }),
    })
});

export const c791 = new VectorLayer({
    title: 'C791',
    source: new VectorSource({
        format: new GeoJson(),
        url: '/geojson/layers/c791.geojson',
        startegy: bbox
    }),
    style: new Style({
        stroke: new Stroke({
            color: gradient,
            width: 6
        }),
    })
});

export const c792 = new VectorLayer({
    title: 'C792',
    source: new VectorSource({
        format: new GeoJson(),
        url: '/geojson/layers/c792.geojson',
        startegy: bbox
    }),
    style: new Style({
        stroke: new Stroke({
            color: gradient,
            width: 6
        }),
    })
});

export const c793 = new VectorLayer({
    title: 'C793',
    source: new VectorSource({
        format: new GeoJson(),
        url: '/geojson/layers/c793.geojson',
        startegy: bbox
    }),
    style: new Style({
        stroke: new Stroke({
            color: gradient,
            width: 6
        }),
    })
});

export const c796 = new VectorLayer({
    title: 'C796',
    source: new VectorSource({
        format: new GeoJson(),
        url: '/geojson/layers/c796.geojson',
        startegy: bbox
    }),
    style: new Style({
        stroke: new Stroke({
            color: gradient,
            width: 6
        }),
    })
});
