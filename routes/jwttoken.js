var express = require('express');
var jwtCtrl = require('../controllers/jwtController')
var router = express.Router();

router.post('/register', jwtCtrl.register)
router.post('/login', jwtCtrl.login)

module.exports = router;