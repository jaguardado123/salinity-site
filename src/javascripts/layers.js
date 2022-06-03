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
export const tceqGageStationLocationsLayer = new VectorLayer({
    title: "Gage Sites <a href='/gagestations/TCEQ.jpg' download>Download JPG</a>",
    visible: true,
    source: new VectorSource({
        strategy: bbox
    }),
    style: new Style({
        image: new Icon({
            src: '/images/tceq-marker.png',
        })
    })
});

// Rio Grande River layer.
export const riogranderiver = new TileLayer({
    title: 'Rio Grande River',
    visible: true,
    source: new TileWMS({
        url: 'http://localhost:8080/geoserver/cite/wms',
        params: {
            'LAYERS': 'cite:RioGrandeRiver',
            'TILED': 'true'
        },
        imageSmoothing: true,
    }),
});


