#!/bin/sh

parcel watch src/javascripts/map.js --out-dir public/javascripts --target browser &
parcel watch src/index.js --target node
