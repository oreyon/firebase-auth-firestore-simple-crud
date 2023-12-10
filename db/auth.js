require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { firebase, admin, usersRef } = require('./firebase');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleAuthRouter = express.Router();

// Configure session middleware
googleAuthRouter.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 24 * 7 * 1000, // 1 week in milliseconds
    },
  })
);

// Initialize Passport and restore authentication state, if any, from the session
googleAuthRouter.use(passport.initialize());
googleAuthRouter.use(passport.session());

// Configure the Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Create or retrieve user in your Firestore database
      const user = {
        uid: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        // Add additional user information if needed
      };

      // Save the user to Firestore
      usersRef.doc(user.uid).set(user, { merge: true }).then(() => done(null, user));
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Set up the Google authentication route
googleAuthRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle the Google callback
googleAuthRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Redirect to the desired route after successful login
    res.redirect('/');
  }
);

module.exports = googleAuthRouter;
