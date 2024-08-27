var express = require('express');
var jwtCtrl = require('../controllers/jwtController')
var jwtmdwr = require('../middlewares/authenticate')
var router = express.Router();

router.post('/register', jwtCtrl.register)
router.post('/login', jwtCtrl.login)
router.post('/profile', jwtmdwr.authenticateToken, jwtCtrl.login)

module.exports = router;