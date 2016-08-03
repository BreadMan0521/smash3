var express = require('express');
var router = express.Router();

/* GET account creation page. */
router.get('/', function(req, res, next) {
  res.render('create_account', {
    title: 'Express'
  });
});

module.exports = router;