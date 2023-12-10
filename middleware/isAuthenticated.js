const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const { auth } = require('firebase-admin');

const isAuthenticated = async (req, res, next) => {
  if (req.session?.uid) {
    return next();
  }
  throw new UnauthenticatedError('Authentication invalid');
};

const authJwt = async (req, res, next) => {
  // check header
  // const authHeader = req.headers.authorization;
}

module.exports = isAuthenticated, authJwt;