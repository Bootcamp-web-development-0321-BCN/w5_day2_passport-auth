const express = require('express');
const { isLoggedIn, checkRole } = require('../middlewares');
const router = express.Router();

router.get('/profile', isLoggedIn, (req, res, next) => {
  res.render('profile', { user: req.user, isAdmin: req.user.role === 'Admin' });
})

router.get('/admin-page', isLoggedIn, checkRole('Admin') ,(req, res, next) => {
  res.render('admin-page', { user: req.user });
})

module.exports = router;