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
                l.c736,
                l.c767,
                l.c789,
                l.c791,
                l.c792,
                l.c793,
                l.c796,
                l.tceqGageStationLocationsLayer,
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

// Plot TCEQ Gage Sites in RGV
fetch('/geojson/layers/gage-station-points.json')
    .then(response => response.json())
    .then(function (data) {

        for (let loc of data.tceq) {
            let marker = new Feature({
                geometry: new Point(fromLonLat(loc.coords)),
                name: loc.name,
                address: ''
            });
            let markerSource = l.tceqGageStationLocationsLayer.getSource();
            markerSource.addFeature(marker);
        }
    });