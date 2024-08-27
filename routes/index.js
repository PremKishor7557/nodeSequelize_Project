var express = require('express');
var registerCtrl = require('../controllers/registerController')
var jwtmdwr = require('../middlewares/authenticate')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/user', function (req, res){
  res.send('Hello World')
})

router.get('/register', (req, res)=>{
  res.render('registeruser');
});
router.post('/register', registerCtrl.upload.single("image") , registerCtrl.registerUser)
router.get('/getusers', registerCtrl.getUsers)
router.get('/login', (req, res)=>{
  res.render('loginuser');
});
router.post('/login', registerCtrl.loginUser)
router.get('/edituser/:id', jwtmdwr.authenticateToken, registerCtrl.getEditUser);
router.post('/edituser/:id', registerCtrl.postEditUser);
router.get('/listuser', registerCtrl.getListUser);


module.exports = router;
