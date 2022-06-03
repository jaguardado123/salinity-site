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
                l.riogranderiver,
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

// Map destination marker
map.on('singleclick', (e) => {
    let feature = map.forEachFeatureAtPixel(e.pixel, (feature) => { return feature; });
    if (feature && feature.get('name')) {
        let featureName = feature.get('name');
        let address = feature.get('address');

        popup.show(feature.getGeometry().getCoordinates(), '<div><h5>' + featureName + '</h5><p>' + address + '</p></div>');
        return;
    }

    let coords = map.getCoordinateFromPixel(e.pixel);
    let marker = new Feature(new Point(coords));

    let markerSource = l.markersLayer.getSource();
    if (markerSource.getFeatures().length >= 2)
        markerSource.clear();

    if (markerSource.getFeatures().length === 1) {
        const newIcon = new Style({ image: new Icon({ anchor: [0.5, 1], src: '/images/tceq-marker.png' }) });
        marker.setStyle(newIcon);
        markerSource.addFeature(marker);
    }
    else
        markerSource.addFeature(marker);
    if (markerSource.getFeatures().length === 2)
        n.beginNav(null, null);
});

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