'use strict';
const Api = require('./api')

module.exports = (app) => {
    app.use(Api)
};