const express = require('express');
const template = require('./views/template');
const path = require('path');
const ssr = require('./views/server');

const initialState = {
  isFetching: false,
  apps: []
};

const webserver = (app) => {
  app
    .get('/', (req, res) => {
      const { preloadedState, content } = ssr(initialState);
      const response = template('Server Rendered Page', preloadedState, content);
      res.setHeader('Cache-Control', 'assets, max-age=604800');
      res.send(response);
    })
    .get('/client', (req, res) => {
      const response = template('Client Side Rendered page');
      res.setHeader('Cache-Control', 'assets, max-age=604800');
      res.send(response);
    })
    .use('/assets', express.static(path.resolve(__dirname, 'assets')))
    .use('/build', express.static(path.resolve(__dirname, 'build')))
    .listen(3000, () => {
      console.log('Listening to port 3000');
    });
};

if (require.main === module) {
  webserver(express());
}

module.exports = webserver;