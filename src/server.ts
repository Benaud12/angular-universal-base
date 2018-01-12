import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';
import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

enableProdMode();

const PORT = process.env.PORT || 4200;
// Should be run from root of the 'dist' directory.
const BROWSER_DIR = join(process.cwd(), 'browser');

const app = express();

const template = readFileSync(join(BROWSER_DIR, 'index.html'))
  .toString();
const { AppServerModuleNgFactory } = require('main.server');

app.engine('html', (_, options, callback) => {
  const opts = { document: template, url: options.req.url };

  renderModuleFactory(AppServerModuleNgFactory, opts)
    .then(html => callback(null, html));
});

app.set('view engine', 'html');
app.set('views', BROWSER_DIR);

app.get('*.*', express.static(join(BROWSER_DIR, 'browser')));

app.get('*', (req, res) => {
  res.render('index', { req });
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}!`);
});
