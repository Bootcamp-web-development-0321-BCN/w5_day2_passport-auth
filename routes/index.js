const express = require('express');
const router  = express.Router();

/* GET home page */

// Passport save user in req.user
router.get('/', (req, res, next) => {
  res.render('index', { user: req.user });
});

module.exports = router;
