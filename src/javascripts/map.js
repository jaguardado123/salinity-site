// Basic rendering
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';

import GeoJson from 'ol/format/GeoJSON';

import * as l from './layers';

// Maker stuff
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';

import GroupLayer from 'ol/layer/Group';

// Custom Control stuffs
import { defaults as defaultControls } from 'ol/control';
import LayerSwitcher from 'ol-layerswitcher';
// import ContextMenu from 'ol-contextmenu';

// Test
import Sidebar from './sidebar';

// Sidebar
export const sidebar = new Sidebar({ element: 'sidebar', position: 'left' });

import Popup from 'ol-popup';


import {Icon, Style} from "ol/style";

const map = new Map({
    controls: defaultControls().extend([
        new LayerSwitcher(),
        sidebar
    ]),
    target: 'map',
    layers: [
        new GroupLayer({
            title: 'Base Maps',
            layers: [
                l.satelliteMap,
                l.osmMap
            ]
        }),
        new GroupLayer({
            title: 'TCEQ',
            fold: 'open',
            layers: [
                new GroupLayer({
                    title: 'Salinity Levels',
                    fold: 'open',
                    layers: [
                        l.c736,
                        l.c767,
                        l.c789,
                        l.c791,
                        l.c792,
                        l.c793,
                        l.c796,
                    ]
                }),
                l.station_coordinates,
            ]
        })
    ],
    view: new View({
        center: fromLonLat([-98.17, 26.30]),
        zoom: 10
    })
});

const popup = new Popup();
map.addOverlay(popup);

// Map destination marker
map.on('singleclick', (e) => {
    let feature = map.forEachFeatureAtPixel(e.pixel, (feature) => { return feature; });
    if (feature && feature.get('name')) {
        let featureName = feature.get('name');
        let address = feature.get('address');

        popup.show(feature.getGeometry().getCoordinates(), '<div><h5>' + featureName + '</h5><p>' + address + '</p></div>');
        return;
    }
});

// Plot TCEQ Gage Sites in RGV
fetch('/geojson/layers/tceq_coordinates.geojson')
    .then(response => response.json())
    .then(function (data) {

        for (let loc of data.features) {
            let marker = new Feature({
                geometry: new Point(fromLonLat(loc.geometry.coordinates)),
                name: loc.properties.Name,
                address: loc.geometry.coordinates[0].toFixed(3)+', '+loc.geometry.coordinates[1].toFixed(3)
            });
            let markerSource = l.station_coordinates.getSource();
            markerSource.addFeature(marker);
        }
    });