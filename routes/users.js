var express = require('express');
const config = require('../config/db')
require('../models')
var userCtrl = require('../controllers/userController')
var userValid = require('../validators/userValidator')
var bodyParser = require('body-parser')
var router = express.Router();

router.use(bodyParser.json())
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/add', userCtrl.addUser)
router.get('/users', userCtrl.getUsers)
router.get('/users/:id', userCtrl.getUser)
router.post('/users', userValid.validationSchema, userValid.validatorUser, userCtrl.postUsers)
router.delete('/users/:id', userCtrl.deleteUser)
router.patch('/users/:id', userValid.validationSchema, userValid.validatorUser, userCtrl.patchUser)
router.get('/query', userCtrl.queryUser)
router.get('/finders', userCtrl.findersUser)
router.get('/get-set-virtual', userCtrl.getSetVirtualUser)
router.get('/validate', userCtrl.validateUser)
router.get('/raw-queries', userCtrl.rawQueriesUser)
router.get('/one-to-one', userCtrl.oneToOneUser)
router.get('/one-to-many', userCtrl.oneToManyUser)
router.get('/many-to-many', userCtrl.manyToManyUser)
router.get("/sendemail", userCtrl.sendMail);

module.exports = router;
