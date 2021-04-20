const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const SlackStrategy = require('passport-slack-oauth2').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');


module.exports = (app) => {
  passport.serializeUser((user, cb) => { cb(null, user._id) });

  passport.deserializeUser((id, cb) => {
    User.findById(id)
      .then(user => cb(null, user))
      .catch((error) => cb(error))
  })

  // Local Strategy
  passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
    User.findOne({ username })
      .then(user => {
        if (!user) {
          return next(null, false, { message: 'Usuario o contraseña incorrectos' });
        }

        if (bcrypt.compareSync(password, user.password)) {
          return next(null, user);
        } else {
          return next(null, false, { message: 'Usuario o contraseña incorrectos.' })
        }
      })
      .catch(error => next(error))
  }))

  // Slack strategy - Social login
  passport.use('slack', new SlackStrategy({
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    callbackURL: "/auth/slack/callback"
  },
    (accessToken, refreshToken, profile, done) => {
      console.log('Slack account:', profile);

      User.findOne({ slackID: profile.id })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }

          User.create({ slackID: profile.id, username: profile.user.name })
            .then(newUser => {
              done(null, newUser)
            })
            .catch(error => done(error))
        })
        .catch(error => done(error))
    }
  ))

  app.use(passport.initialize());
  app.use(passport.session());
}