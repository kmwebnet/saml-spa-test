"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    saml: {
        cert: "./config/saml.pem",
        entryPoint: "https://some-id-provider.com/auth/realms/kmwebnet/protocol/saml",
        issuer: "samltest",
        options: {
            failureRedirect: "/slogin",
            failureFlash: true
        }
    },
    server: {
        port: 5000
    },
    session: {
        resave: false,
        secret: "secret",
        cookie: { maxAge: 3600000 },
        saveUninitialized: true
    }
};
exports.default = config;
