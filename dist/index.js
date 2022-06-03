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
});
module.exports = router;
},{}],"../routes/api.js":[function(require,module,exports) {
const express = require('express');

const router = express.Router();
module.exports = router;
},{}],"app.js":[function(require,module,exports) {
require('dotenv').config(); // require('dotenv').config({ path: '/app/srv/www/.env'});


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
},{"../routes/index":"../routes/index.js","../routes/api":"../routes/api.js"}],"index.js":[function(require,module,exports) {
/**
 * Module dependencies.
 */
var app = require('./app');

var debug = require('debug')('civil-site:server');

var http = require('http');
/**
 * Get port from environment and store in Express.
 */


var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
/**
 * Create HTTP server.
 */

var server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
/**
 * Event listener for HTTP server "error" event.
 */


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port; // handle specific listen errors with friendly messages

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;

    default:
      throw error;
  }
}
/**
 * Event listener for HTTP server "listening" event.
 */


function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
},{"./app":"app.js"}]},{},["index.js"], null)
//# sourceMappingURL=/index.js.map