"use strict";
/*
simple saml server
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const http_1 = __importDefault(require("http"));
// import https from 'https';
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logging_1 = __importDefault(require("./config/logging"));
const config_1 = __importDefault(require("./config/config"));
require("./config/passport");
const options = {
    key: fs_1.default.readFileSync('/usr/src/app/certs/server.key'),
    cert: fs_1.default.readFileSync('/usr/src/app/certs/server.chain'),
    ca: [
        fs_1.default.readFileSync('/usr/src/app/certs/signer-ca.crt'),
        fs_1.default.readFileSync('/usr/src/app/certs/root-ca.crt'),
    ],
    // requestCert: true,
    // rejectUnauthorized: true,
};
const app = express_1.default();
//const httpsserver = https.createServer(options, app);
const httpsserver = http_1.default.createServer(app);
// app
app.use('/', express_1.default.static(__dirname + '/dist'));
/** Log the request */
app.use((req, res, next) => {
    logging_1.default.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging_1.default.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
    next();
});
/** Parse the body of the request / Passport */
app.use(express_session_1.default(config_1.default.session));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.urlencoded({ extended: false })); // Replaces Body Parser
app.use(express_1.default.json()); // Replaces Body Parser
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
app.get('/slogin', passport_1.default.authenticate('saml', config_1.default.saml.options), (req, res, next) => {
    return res.redirect('http://example.com:4000');
});
app.post('/slogin/callback', passport_1.default.authenticate('saml', config_1.default.saml.options), (req, res, next) => {
    return res.redirect('http://example.com:4000');
});
app.get('/slogout', (req, res, next) => {
    if (req.isAuthenticated()) {
        req.session.destroy((err) => {
            res.send(err);
        });
    }
    return res.redirect('http://example.com:4000');
});
app.get('/whoami', (req, res, next) => {
    if (!req.isAuthenticated()) {
        logging_1.default.info('User not authenticated');
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    else {
        logging_1.default.info('User authenticated');
        logging_1.default.info(req.user);
        return res.status(200).json({ user: req.user });
    }
});
/** Health Check */
app.get('/healthcheck', (req, res, next) => {
    return res.status(200).json({ message: 'Server is running!' });
});
// for react-router
app.get('/*', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, 'dist', 'index.html'));
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
