/*
simple saml server
*/

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import http from 'http';
// import https from 'https';
import fs from 'fs';
import path from 'path';
import logging from './config/logging';
import config from './config/config';
import './config/passport';

const options = {
  key: fs.readFileSync('/usr/src/app/certs/server.key'),
  cert: fs.readFileSync('/usr/src/app/certs/server.chain'),
  ca: [
    fs.readFileSync('/usr/src/app/certs/signer-ca.crt'),
    fs.readFileSync('/usr/src/app/certs/root-ca.crt'),
  ],
  // requestCert: true,
  // rejectUnauthorized: true,
};

const app = express();
//const httpsserver = https.createServer(options, app);
const httpsserver = http.createServer(app);

// app
app.use('/', express.static(__dirname + '/dist'));



/** Log the request */
app.use((req, res, next) => {
  logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

  res.on('finish', () => {
      logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
  });

  next();
});

/** Parse the body of the request / Passport */
app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false })); // Replaces Body Parser
app.use(express.json()); // Replaces Body Parser

/** Rules of our API */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }

  next();
});

/** Passport & SAML Routes */
app.get('/slogin', passport.authenticate('saml', config.saml.options), (req, res, next) => {
  return res.redirect('http://example.com:4000');
});

app.post('/slogin/callback', passport.authenticate('saml', config.saml.options), (req, res, next) => {
  return res.redirect('http://example.com:4000');
});

app.get('/slogout',  (req, res, next) => {
  if (req.isAuthenticated()) {
    req.session.destroy((err) => {
      res.send(err);
    });
  }
  return res.redirect('http://example.com:4000');
});

app.get('/whoami', (req, res, next) => {
  if (!req.isAuthenticated()) {
      logging.info('User not authenticated');

      return res.status(401).json({
          message: 'Unauthorized'
      });
  } else {
      logging.info('User authenticated');
      logging.info(req.user);

      return res.status(200).json({ user: req.user });
  }
});

/** Health Check */
app.get('/healthcheck', (req, res, next) => {
  return res.status(200).json({ message: 'Server is running!' });
});

// for react-router
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
});


/** Error handling */
app.use((req, res, next) => {
  const error = new Error('Not found');

  res.status(404).json({
      message: error.message
  });
});


// run server
httpsserver.listen(4000, () => console.log('Listening on port 4000'));
