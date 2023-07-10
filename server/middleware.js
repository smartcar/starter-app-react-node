'use strict';
const { getAccess } = require('./utils');

const authenticate = (req, res, next) => {
    req.tokens = getAccess(req)
    return next()
}

module.exports = { authenticate };