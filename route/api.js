const express = require("express");
const router = express.Router();
const { userModel } = require("../db");
const bcrypt = require("bcrypt");
const path = require("path");

router.get("/", (req, res) => {
  res.send("api is sending from authServise");
});

//userdata by username
router.get("/userByUsername/:username", (req, res) => {
  userModel.find({ username: req.params.username }).exec((err, data) => {
    if (err) throw err;
    data[0].password = null;
    res.send(data[0]);
  });
});

// is username present already
router.get("/is/username/duplicate/:username", (req, res) => {
  userModel.find({ username: req.params.username }).exec((err, data) => {
    if (err) throw err;
    if (data.length) {
      res.send({ msg: "Username is already taken", result: 0 });
    } else res.send({ msg: "Username available", result: 1 });
  });
});
//userdata by userId
router.get("/user/:id", (req, res) => {
  if (req.params.id) {
    try {
      userModel.find({ _id: req.params.id }).exec((err, data) => {
        if (err) throw err;
        data.password = null;
        res.send(data[0]);
      });
    } catch (error) {
      res.send("user id is not reachable");
    }
  }
});

// login is here
router.post("/login", (req, res) => {
  // find userdata by username
  userModel.find({ email: req.body.email }).exec(async (err, data) => {
    if (err) throw err;

    if (data.length) {
      // compare password
      if (data[0].password == req.body.password) {
        let user = data[0];
        user = { ...user, password: null };
        res.send({
          status: 1,
          msg: `Login Successful.`,
          data: data[0],
        });
      } else res.send({ status: 0, msg: "please check your password" });
    } else res.send({ status: 0, msg: "user does not exist" });
  });
});

//sign up here
router.post("/signup", (req, res) => {
  //check for username duplicasy
  userModel.find({ username: req.body.username }).exec((err, data) => {
    if (err) throw err;

    if (data.length) {
      res.send({
        status: 0,
        msg: "this username is already exist, try any other username",
      });
    } else {
      let userdata = {
        username: req.body.username,
        password: req.body.password,
      };
      // save userdata to database
      userModel.create(userdata, (err, resp) => {
        if (err) throw err;
        resp.password = null;
        res.send({
          status: 1,
          msg: "user registered successfully",
          user: resp,
        });
      });
    }
  });
});

module.exports = router;
