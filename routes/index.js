require("dotenv").config();
var express = require("express");
const MongoClient = require("mongodb").MongoClient;
// const {username, password, database} = require('../config');
const database = "express-login";
const dbUrl = process.env.DBURL;
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  hbsObject = {
    title: "login page",
    action: "/login",
    button: "Login",
    anchar: "Signup",
    href: "/signup",
    username: false,
  };
  res.render("index", hbsObject);
});
router.get("/signup", (req, res, next) => {
  hbsObject = {
    title: "signup page",
    action: "/signup",
    button: "Signup",
    anchar: "login",
    href: "/",
    username: true,
  };
  res.render("index", hbsObject);
});

router.post("/signup", (req, res, next) => {
  // console.log(req.body);
  console.log(dbUrl);

  MongoClient.connect(dbUrl, { useUnifiedTopology: true }, (error, client) => {
    if (error) {
      console.log("DataBase Connection Error");
      // console.log(error);
      hbsObject = {
        title: "signup page",
        action: "/signup",
        button: "Signup",
        anchar: "login",
        href: "/",
        username: true,
        error: true,
        error_message: "Database Connection Error",
      };
      res.render("index", hbsObject);
    } else {
      client
        .db(database)
        .collection("users")
        .insertOne(req.body, (error, data) => {
          if (error) {
            console.log("Database insert error");
            // console.log(error);
            hbsObject = {
              title: "signup page",
              action: "/signup",
              button: "Signup",
              anchar: "login",
              href: "/",
              username: true,
              error: true,
              error_message: "Signup Failed Please Try Again Later",
            };
            res.render("index", hbsObject);
          } else {
            console.log("Database insert sucess");
            // console.log(data.ops);
            hbsObject = {
              title: "signup sucess",
              user: req.body.username,
              done: "signup",
              click: true,
              completed: "completed",
            };
            res.render("signup_or_login_sucess", hbsObject);
          }
          client.close();
        });
    }
  });
});
router.get("/login", function (req, res, next) {
  res.redirect("/");
});

router.post("/login", (req, res, next) => {
  // console.log(req.body);
  console.log(dbUrl);
  MongoClient.connect(dbUrl, { useUnifiedTopology: true }, (error, client) => {
    if (error) {
      console.log("DataBase Connection Error");
      console.log(error);
      hbsObject = {
        title: "login page",
        action: "/login",
        button: "Login",
        anchar: "Signup",
        href: "/signup",
        username: false,
        error: true,
        error_message: "Database Connection Error",
      };
      res.render("index", hbsObject);
    } else {
      client
        .db(database)
        .collection("users")
        .findOne({ email: req.body.email }, (error, data) => {
          if (error) {
            console.log("error in find method");
            // console.log(error);
            hbsObject = {
              title: "login page",
              action: "/login",
              button: "Login",
              anchar: "Signup",
              href: "/signup",
              username: false,
              error: true,
              error_message: "User Not Found",
            };
            res.render("index", hbsObject);
          } else if (data) {
            console.log("find done. data is :");
            // console.log(data);
            if (req.body.password == data.password) {
              console.log("password matched");
              hbsObject = {
                title: "login sucess",
                user: data.username,
                done: "login",
                completed: "sucessfull",
              };
              res.render("signup_or_login_sucess", hbsObject);
            } else {
              console.log("credentials missmatch");
              hbsObject = {
                title: "login page",
                action: "/login",
                button: "Login",
                anchar: "Signup",
                href: "/signup",
                username: false,
                pass_wrong: true,
              };
              res.render("index", hbsObject);
            }
          } else {
            console.log("data not found");
            hbsObject = {
              title: "login page",
              action: "/login",
              button: "Login",
              anchar: "Signup",
              href: "/signup",
              username: false,
              no_acc: true,
            };
            res.render("index", hbsObject);
          }
          client.close();
        });
    }
  });
});

module.exports = router;
