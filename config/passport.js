"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const passport_1 = __importDefault(require("passport"));
const passport_saml_1 = require("passport-saml");
const config_1 = __importDefault(require("./config"));
const logging_1 = __importDefault(require("./logging"));
const savedUsers = [];
passport_1.default.serializeUser((expressUser, done) => {
    logging_1.default.info(expressUser, 'Serialize User');
    done(null, expressUser);
});
passport_1.default.deserializeUser((expressUser, done) => {
    logging_1.default.info(expressUser, 'Deserialize User');
    done(null, expressUser);
});
passport_1.default.use(new passport_saml_1.Strategy({
    issuer: config_1.default.saml.issuer,
    protocol: 'https://',
    path: '/slogin/callback',
    entryPoint: config_1.default.saml.entryPoint,
    cert: fs_1.default.readFileSync(config_1.default.saml.cert, 'utf-8')
}, (expressUser, done) => {
    if (!savedUsers.includes(expressUser)) {
        savedUsers.push(expressUser);
    }
    return done(null, expressUser);
}));
