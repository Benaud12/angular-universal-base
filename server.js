'use strict'
require('zone.js/dist/zone-node');
const { renderModuleFactory } = require('@angular/platform-server');
const { enableProdMode } = require('@angular/core');
const express = require('express');
const { join } = require('path');
const { readFileSync } = require('fs');
const awsExpressMiddleware = require('aws-serverless-express/middleware');

enableProdMode();

// Should be run from root of the 'dist' directory.
const BROWSER_DIR = join(process.cwd(), 'browser');

const app = express();

app.use(awsExpressMiddleware.eventContext());

const template = readFileSync(join(BROWSER_DIR, 'index.html')).toString();
const { AppServerModuleNgFactory } = require('./server/main.bundle');

app.engine('html', (_, options, callback) => {
  const opts = { document: template, url: options.req.url };

  renderModuleFactory(AppServerModuleNgFactory, opts)
    .then(html => callback(null, html));
});

app.set('view engine', 'html');
app.set('views', BROWSER_DIR);

app.get('*.*', express.static(BROWSER_DIR));

app.get('*', (req, res) => {
  res.render('index', { req });
});

module.exports = app;
