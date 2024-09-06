var express = require('express');
var {redisClient, sessionMiddleware} = require('../config/radis')
var registerCtrl = require('../controllers/registerController')
var registerValid = require('../validators/userValidator')
var jwtmdwr = require('../middlewares/authenticate')
//var nodemailer = require('../nodemailers/sendEmail')

var router = express.Router();

router.use(sessionMiddleware);
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

router.post('/register',
  registerCtrl.upload.single("image"),
  registerValid.registerValidation,
  registerValid.validatorUser, 
  registerValid.validateImage, 
  registerCtrl.registerUser
)

router.get('/login', (req, res)=>{
  res.render('loginuser');
});

router.post('/login', 
  registerValid.loginValidation,
  registerValid.validatorUser,
  registerCtrl.loginUser
)

//router.use(jwtmdwr.authenticateToken);
router.get('/getuser', jwtmdwr.isAuthenticated, registerCtrl.getUserDetails)
router.get('/edituser/:id', registerCtrl.getEditUser);
router.post('/edituser/:id', registerCtrl.postEditUser);
router.get('/listuser', registerCtrl.getListUser);
router.get('/verify-otp', (req, res)=>{
  res.render('verifyOtp');
});
router.post('/verify-otp', registerCtrl.verifyOtp);
router.get('/verify-email', registerCtrl.verifyEmail);
registerCtrl.sendReminderEmails();
//registerCtrl.stopReminderEmails();

module.exports = router;
