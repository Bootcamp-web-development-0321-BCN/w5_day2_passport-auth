const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User.model');
const { isLoggedOut } = require('../middlewares');
const transporter = require('../configs/nodemailer.config');
const mailTemplate = require('../templates/mail.template');
const router = express.Router();
const saltRounds = 10;

router.get('/signup', isLoggedOut, (req, res) => {
  res.render('signup');
})

router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('signup', { errorMessage: 'Username and password are required.' })
  }

  // const regularExpresion = new RegExp('');
  // regularExpresion.test(password)

  if (password.length < 3) {
    res.render('signup', { errorMessage: 'Password should have at least 3 characters' })
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        return res.render('signup', { errorMessage: 'User already exists.' })
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })
        .then((newUser) => {
          // return res.redirect('/');
          req.login(newUser, (error) => {
            if (error) {
              next(error)
            }
            transporter.sendMail({
              from: "Contacto web <ironhacknodemailer@gmail.com>",
              to: "diego.mendez@tailor-hub.com", // email from signup form
              subject: "Bienvenido a mi aplicación",
              text: "Bienvenido",
              html: mailTemplate(username),
            })
              .then(() => {
                return res.redirect('/private/profile')
              })
              .catch(error => {
                console.log(error);
                return res.redirect('/private/profile');
              })

          })
        })
        .catch((error) => {

          console.log(error);
          return res.render('signup', { errorMessage: 'Server error. Try again.' })
        })

    })
});

router.get('/login', isLoggedOut, (req, res) => {
  res.render('login');
})

router.post('/login', passport.authenticate("local", {
  successRedirect: "/private/profile",
  failureRedirect: "/auth/login",
  passReqToCallback: true
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

router.get("/slack", passport.authenticate('slack'));
router.get("/slack/callback", passport.authenticate('slack', {
  successRedirect: "/private/profile",
  failureRedirect: "/auth/login"
}))

module.exports = router;