var express = require('express');
var registerCtrl = require('../controllers/registerController')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/user', function (req, res){
  res.send('Hello World')
})

router.get('/adduser', (req, res)=>{
  res.render('adduser');
});
router.post('/adduser', registerCtrl.upload.single("image") , registerCtrl.registerUser)
router.get('/edituser/:id', registerCtrl.getEditUser);
router.post('/edituser/:id', registerCtrl.postEditUser);
router.get('/listuser', registerCtrl.getListUser);


module.exports = router;
