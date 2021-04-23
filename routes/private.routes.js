const express = require('express');
const uploader = require('../configs/cloudinary.config');
const { isLoggedIn, checkRole } = require('../middlewares');
const User = require('../models/User.model');
const router = express.Router();

router.get('/profile', isLoggedIn, (req, res, next) => {
  res.render('profile', { user: req.user, isAdmin: req.user.role === 'Admin' });
})

router.get('/admin-page', isLoggedIn, checkRole('Admin') ,(req, res, next) => {
  res.render('admin-page', { user: req.user });
})

router.get('/edit', isLoggedIn,(req, res, next) => {
  res.render('edit', { user: req.user });
})

router.post('/edit', uploader.single('image') ,(req, res, next) => {
  const { username } = req.body;
  if(req.file){
    // User.findOneAndUpdate({ _id: req.user._id }, { username, profile_pic: req.file.path}, )
    User.findOneAndUpdate({ _id: req.user._id }, { username:username, profile_pic: req.file.path}, { new: true })
    .then(() => {
      res.redirect('/private/profile')
    })
    .catch(error => next(error))
  }
  res.render('edit', { user: req.user });
})

module.exports = router;