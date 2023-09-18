var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({endpoint: 'your at home'});
});

module.exports = router;
