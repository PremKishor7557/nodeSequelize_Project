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

router.get('/add', (req, res)=>{
  res.render('adduser');
});
router.post('/add', registerCtrl.upload.single("image") , registerCtrl.registerUser)
router.get('/edit/:id', registerCtrl.getEditUser);
router.post('/edit/:id', registerCtrl.postEditUser);

module.exports = router;
