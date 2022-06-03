#!/bin/sh

parcel build src/javascripts/map.js --out-dir public/javascripts --target browser
parcel build src/index.js --target node
