require('dotenv').config();
// require('dotenv').config({ path: '/app/srv/www/.env'});

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const compression = require('compression');

const indexRouter = require('../routes/index');
const apiRouter = require('../routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sassMiddleware({
  src: path.join(__dirname, '../src/sass'),
  dest: path.join(__dirname, '../public/stylesheets'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: false,
  outputStyle: 'compressed',
  prefix: '/stylesheets'
}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(compression());

app.use('/', indexRouter);
app.use('/api', apiRouter);

// External things
app.use('/mod/bs', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use('/mod/jq', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use('/mod/ol', express.static(path.join(__dirname, '../node_modules/ol')));
app.use('/mod/fa', express.static(path.join(__dirname, '../node_modules/font-awesome/css')));
app.use('/mod/ol-ls', express.static(path.join(__dirname, '../node_modules/ol-layerswitcher/src')));
app.use('/mod/ol-cm', express.static(path.join(__dirname, '../node_modules/ol-contextmenu/dist')));
app.use('/mod/ol-pu', express.static(path.join(__dirname, '../node_modules/ol-popup/src')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
