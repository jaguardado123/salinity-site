// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../routes/index.js":[function(require,module,exports) {
var express = require('express');

const fs = require("fs");

var router = express.Router();
/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('home');
}); // Receives POSTed HRRR data and rewrites HTML table and CSV file.

router.post('/get_hrrr', function (req, res) {
  res.send({
    "msg": "Thank you!"
  }); // Write necessary HTML to create a table.

  let line = "<html><head><title>VCORE | HRRR</title><link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\" integrity=\"sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm\" crossorigin=\"anonymous\"></head>";
  line += "<body><img width='400px' src='https://vcore.utrgv.edu/images/cameron-subbasin.png'><img width='500px' src='https://vcore.utrgv.edu/images/willacy-subbasin.png'><table class='table'><tr><th>Basin</th><th colspan='36'>HRRR data for the next 36 hours starting from " + req.body.time + ":00</th></tr>";
  fs.writeFileSync("/srv/www/public/HRRR/grib2.html", line); // Clear and write into HTML file.

  fs.writeFileSync("/srv/www/public/HRRR/grib2.csv", "Latitude1, Longitude1, Latitude2, Longitude2, Basin, HRRR Data from " + req.body.time + ":00\n"); // Clear and write into CSV file.

  var i = 0;

  for (let hrrr of req.body.hrrr) {
    // Append necessary HTML tags.
    line = '<tr><td>' + hrrr.basin + '</td>';

    for (let grb of hrrr.grib2) {
      line += '<td>' + grb + '</td>';
    }

    fs.appendFileSync("/srv/www/public/HRRR/grib2.html", line); // If it's the last line, close necessary HTML tags.

    if (i >= req.body.hrrr.length - 1) {
      line = "</table></body></html>";
      fs.appendFileSync("/srv/www/public/HRRR/grib2.html", line);
    }

    i++;
    fs.appendFileSync("/srv/www/public/HRRR/grib2.csv", hrrr.latt[0] + "," + hrrr.lon[0] + "," + hrrr.latt[1] + "," + hrrr.lon[1] + "," + hrrr.basin + "," + hrrr.grib2 + "\n");
  }
});
module.exports = router;
},{}],"../routes/api.js":[function(require,module,exports) {
const express = require('express');

const router = express.Router();

const fetch = require('node-fetch');

const fs = require('fs');

const util = require('util');

const readFile = util.promisify(fs.readFile);

const bodyParser = require('body-parser'); // Create cache for this function since conditions update every 5 minutes.


router.get('/dtx', function (req, res, next) {
  fetch(`https://api.drivetexas.org/api/conditions.geojson?key=${process.env.DRIVE_TEXAS_API}`).then(response => response.json()).then(function (response) {
    let feature = {
      type: "FeatureCollection",
      features: []
    };

    for (let i = 0; i < response.features.length; i++) {
      if (response.features[i].properties.condition === req.query.feature) {
        feature.features.push(response.features[i]);
      }
    }

    res.json(feature);
  });
}); // Send coordinates to ORS API and shape file if selected.

router.post('/ors', async function (req, res, next) {
  let body = {
    coordinates: req.body.coordinates
  };

  if (req.body.visible) {
    let polygons = {
      avoid_polygons: {}
    };
    body.options = await get_polygon(req.body.layer + '.geojson').then(data => {
      polygons.avoid_polygons = JSON.parse(data).geometries[0];
      return polygons;
    });
  }

  fetch("http://129.113.4.41:8080/ors/v2/directions/driving-car/geojson", {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  }).then(response => response.json()).then(function (directions) {
    res.send(directions);
  });
});

function get_polygon(fileName) {
  return readFile('/srv/www/public/geojson/' + fileName);
}

module.exports = router;
},{}],"app.js":[function(require,module,exports) {
require('dotenv').config();

const createError = require('http-errors');

const express = require('express');

const path = require('path');

const logger = require('morgan');

const sassMiddleware = require('node-sass-middleware');

const compression = require('compression');

const indexRouter = require('../routes/index');

const apiRouter = require('../routes/api');

const app = express(); // view engine setup

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(sassMiddleware({
  src: path.join(__dirname, '../src/sass'),
  dest: path.join(__dirname, '../public/stylesheets'),
  indentedSyntax: true,
  // true = .sass and false = .scss
  sourceMap: false,
  outputStyle: 'compressed',
  prefix: '/stylesheets'
}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(compression());
app.use('/', indexRouter);
app.use('/api', apiRouter); // External things

app.use('/mod/bs', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use('/mod/jq', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use('/mod/ol', express.static(path.join(__dirname, '../node_modules/ol')));
app.use('/mod/fa', express.static(path.join(__dirname, '../node_modules/font-awesome/css')));
app.use('/mod/ol-ls', express.static(path.join(__dirname, '../node_modules/ol-layerswitcher/src')));
app.use('/mod/ol-cm', express.static(path.join(__dirname, '../node_modules/ol-contextmenu/dist')));
app.use('/mod/ol-pu', express.static(path.join(__dirname, '../node_modules/ol-popup/src'))); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
},{"../routes/index":"../routes/index.js","../routes/api":"../routes/api.js"}]},{},["app.js"], null)
//# sourceMappingURL=/app.js.map