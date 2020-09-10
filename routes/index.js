var express = require('express');
const mongodb = require('mongodb');

var router = express.Router();
const MongoClient = mongodb.MongoClient;

/* GET home page. */
router.get('/', function (req, res, next) {
  hbsObject = {title:'login page',action:'/login',button:'Login',anchar:'Signup',href:'/signup'};
  res.render('index',hbsObject);
});
router.get('/signup',(req, res, next)=>{
  hbsObject = {title:'signup page',action:'/signup',button:'Signup',anchar:'login',href:'/'};
  res.render('index',hbsObject)
});

router.post('/signup', (req, res, next) => {
  console.log(req.body);

  MongoClient.connect('mongodb://127.0.0.1:27017', (error, client) => {
    
    if (error) {
      console.log('DataBase Connection Error');
    }
    else {
      client.db('database').collection('data').insertOne(req.body);
    }

  });
  
  hbsObject = {title:'signup sucess',user:req.body.username,done:'signup',click:true};
  res.render('signup_or_login_sucess',hbsObject);
});

router.post('/login',(req,res,next) => {
  
});

module.exports = router;
