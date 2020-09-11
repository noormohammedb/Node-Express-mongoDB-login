var express = require('express');
const MongoClient = require('mongodb').MongoClient;

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  hbsObject = {title:'login page',action:'/login',button:'Login',anchar:'Signup',href:'/signup',username:false};
  res.render('index',hbsObject);
});
router.get('/signup',(req, res, next)=>{
  hbsObject = {title:'signup page',action:'/signup',button:'Signup',anchar:'login',href:'/',username:true};
  res.render('index',hbsObject)
});

router.post('/signup', (req, res, next) => {
  console.log(req.body);

  MongoClient.connect('mongodb://127.0.0.1:27017',{useUnifiedTopology:true}, (error, client) => {
    
    if (error) {
      console.log('DataBase Connection Error');
      console.log(error);
      res.send('Database Error')
    }
    else {
      client.db('express').collection('users').insertOne(req.body,(error,data)=>{
        if(error){
          console.log('Database insert error');
          console.log(error);
          res.send('database insert error');
        }
        else{
          console.log('Database insert sucess');
          console.log(data.ops);
          hbsObject = {title:'signup sucess',user:req.body.username,done:'signup',click:true};
          res.render('signup_or_login_sucess',hbsObject);
        }
        client.close();
      });
    }

  });
  
});

router.post('/login',(req,res,next) => {
  console.log(req.body);

  MongoClient.connect('mongodb://127.0.0.1:27017/',{useUnifiedTopology:true},(error,client)=>{
    if(error){
      console.log("DataBase Connection Error");
      console.log(error);
      res.send('DataBase Error');
    }
    else{
      client.db('express').collection('users').findOne({email:req.body.email},(error,data)=>{
        if(error){
          console.log('error in find method');
          console.log(error);
          res.send('data not found');
        }
        else if(data){
          console.log('find done. data is :');
          console.log(data);
            if(req.body.password == data.password){
              console.log('password matched');
              hbsObject = {title:'login sucess',user:data.username,done:'login',click:false};
              res.render('signup_or_login_sucess',hbsObject);
            }
            else{
              console.log('credentials missmatch')
              res.send('credentials missmatch')
            }
        }
        else{
          console.log('data not found');
          res.send('not exist')
        }
        client.close();
      });
    }
  });
  
});

module.exports = router;