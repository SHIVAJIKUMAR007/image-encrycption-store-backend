const express = require("express");
const router = express.Router();
const { userModel, countModel } = require("../db");
const bcrypt = require("bcrypt");
const path = require("path");
const { newsFeedService } = require("../axios");

router.get("/", (req, res) => {
  res.send("api is sending from authServise");
});

//user by Similer collage
router.get("/userByCollage/:collageTag", (req, res) => {
  const collages = req.params.collageTag.toUpperCase().split(",");
  let ans = new Array();
  collages.length
    ? collages.map((collage, i) => {
        userModel
          .find({ collageShort: { $regex: collage } })
          .exec((err, data) => {
            if (err) throw err;
            ans = [...ans, ...data];
            if (i === collages.length - 1) {
              let set = new Set(ans);
              res.send([...set]);
            }
          });
      })
    : res.send("no collage tag is present");
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
  if (req.params.id === "undefined") {
    res.send("user id is not send");
  } else {
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
      const compare = await bcrypt.compare(req.body.password, data[0].password);
      if (compare) {
        data[0].password = null;
        res.send({
          msg: `Hey ${data[0].name}, welcome to MatesCon world`,
          data: data[0],
        });
      } else res.send({ msg: "please check your password" });
    } else res.send({ msg: "user does not exist" });
  });
});

//sign up here
router.post("/signup", (req, res) => {
  //check for username duplicasy
  userModel.find({ username: req.body.username }).exec((err, data) => {
    if (err) throw err;

    if (data.length) {
      res.send("this username is already exist, try any other username");
    } else {
      //check for email duplicasy
      userModel.find({ email: req.body.email }).exec(async (err2, data2) => {
        if (err2) throw err2;

        if (data2.length) {
          res.send({ msg: "this email is already exist, try any other email" });
        } else {
          //hashing the password
          const hashPass = await bcrypt.hash(req.body.password, 2);
          const userdata = req.body;
          userdata.password = hashPass;
          userdata.timeOfSignup = Date.now();

          // save userdata to database
          userModel.create(userdata, (err, resp) => {
            if (err) throw err;
            resp.password = null;
            res.send({ msg: "user registered successfully", user: resp });
          });
        }
      });
    }
  });
});
//after Sign up get extra data
router.post("/update/profilePic/:uid", (req, res) => {
  if (req.files == null) {
    return res.status(400).json({ msg: "no file uploaded" });
  }
  const time = Date.now();
  const file = req.files.pic;
  const fileName = `${time}_${req.params.uid}${path.extname(file.name)}`;
  const destination = `./public/profilePic/${fileName}`;

  file.mv(destination, (err) => {
    if (err) {
      return res.status(500).send({ msg: "file transfer issue" });
    }
  });
  userModel.updateOne(
    { _id: req.params.uid },
    { profilePic: `/profilePic/${fileName}` },
    (err2, data2) => {
      if (err2) throw err2;
      res.send({ msg: "ok", fileName: fileName });
    }
  );
});
router.post("/update/extraData/:uid", (req, res) => {
  const update = {
    bio: req.body.bio,
    signUpProcess: true,
    passingYear: req.body.passingYear,
    collageOfInterest: req.body.collageInterest,
    collageFull: req.body.collageFull.toUpperCase(),
    collageShort: req.body.collageShort.toUpperCase(),
  };

  userModel.findById(req.params.uid, (err, data) => {
    if (err) throw err;
    userModel.updateOne(
      { _id: req.params.uid },
      update,
      async (err2, data2) => {
        if (err2) throw err2;
        //create feed first  otherwise what you will show him in the home
        const createFeed = await (
          await newsFeedService.get(`/createUser/${req.params.uid}`)
        ).data;
        //send data to user
        res.send({ msg: "ok", result: data });
        //make count table of user
        countModel.create(
          {
            userId: req.params.uid,
            followers: 0,
            following: 0,
            postNum: 0,
            queNum: 0,
            ansNum: 0,
            strickNum: 0,
          },
          (err3, data3) => {
            if (err3) throw err3;
            return;
          }
        );
      }
    );
  });
});

//update whole user
router.post("/update/wholeData/:uid", (req, res) => {
  const update = {
    name: req.body.name,
    username: req.body.username,
    collageFull: req.body.collageFull,
    collageInterest: req.body.collageInterest,
    collageShort: req.body.collageShort,
    collageStatus: req.body.collageStatus,
    bio: req.body.bio,
  };
  userModel.findById(req.params.uid, (err, data) => {
    if (err) throw err;
    userModel.updateOne({ _id: req.params.uid }, update, (err2, data2) => {
      if (err2) throw err2;
      res.send({ msg: "ok", result: { ...data, ...update } });
    });
  });
});

//update password

router.post("/update/pass/:uid", (req, res) => {
  userModel.findById(req.params.uid, async (err, data) => {
    if (err) throw err;
    const compare = bcrypt.compare(req.body.currentPassword, data.password);
    if (compare) {
      const hash = await bcrypt.hash(req.body.newPassword, 2);
      userModel.updateOne(
        { _id: req.params.uid },
        { password: hash },
        (err2, data2) => {
          if (err2) throw err2;
          res.send({ msg: "ok" });
        }
      );
    } else {
      res.send({ msg: "you entered wrong current password" });
    }
  });
});

// add credit score of user
router.post("/addCredit/:amount/:uid", (req, res) => {
  userModel.findById(req.params.uid, (err2, data2) => {
    userModel.updateOne(
      { _id: req.params.uid },
      { creditScore: data2.creditScore + parseInt(req.params.amount) },
      (err, data) => {
        if (err) throw err;
        res.send({
          msg: "credit score is added",
          creditAdded: parseInt(req.params.amount),
          currCredit: data2.creditScore + parseInt(req.params.amount),
        });
      }
    );
  });
});

//get user count data
router.get("/countData/:uid", (req, res) => {
  countModel.find({ userId: req.params.uid }).exec((err, data) => {
    if (err) throw err;
    res.send(data[0]);
  });
});
//update follower in user count table
router.post("/update/countData/follower/:uid/:value", (req, res) => {
  countModel.find({ userId: req.params.uid }).exec((err, data) => {
    if (err) throw err;
    const value = req.params.value;
    countModel.updateOne(
      { userId: req.params.uid },
      { followers: parseInt(data[0].followers) + parseInt(value) },
      (err2, data2) => {
        if (err2) throw err2;
        res.send(`Your data is updated`);
      }
    );
  });
});
//update following in user count table
router.post("/update/countData/following/:uid/:value", (req, res) => {
  countModel.find({ userId: req.params.uid }).exec((err, data) => {
    if (err) throw err;
    const value = req.params.value;
    countModel.updateOne(
      { userId: req.params.uid },
      { following: parseInt(data[0].following) + parseInt(value) },
      (err2, data2) => {
        if (err2) throw err2;
        res.send(`Your data is updated`);
      }
    );
  });
});
//update postNum in user count table
router.post("/update/countData/postNum/:uid/:value", (req, res) => {
  countModel.find({ userId: req.params.uid }).exec((err, data) => {
    if (err) throw err;
    const value = req.params.value;
    countModel.updateOne(
      { userId: req.params.uid },
      { postNum: parseInt(data[0].postNum) + parseInt(value) },
      (err2, data2) => {
        if (err2) throw err2;
        res.send(`Your postNum data is updated`);
      }
    );
  });
});
//update queNum in user count table
router.post("/update/countData/queNum/:uid/:value", (req, res) => {
  countModel.find({ userId: req.params.uid }).exec((err, data) => {
    if (err) throw err;
    const value = req.params.value;
    countModel.updateOne(
      { userId: req.params.uid },
      { queNum: parseInt(data[0].queNum) + parseInt(value) },
      (err2, data2) => {
        if (err2) throw err2;
        res.send(`Your data is updated`);
      }
    );
  });
});
//update ansNum in user count table
router.post("/update/countData/ansNum/:uid/:value", (req, res) => {
  countModel.find({ userId: req.params.uid }).exec((err, data) => {
    if (err) throw err;
    const value = req.params.value;
    countModel.updateOne(
      { userId: req.params.uid },
      { ansNum: parseInt(data[0].ansNum) + parseInt(value) },
      (err2, data2) => {
        if (err2) throw err2;
        res.send(`Your data is updated`);
      }
    );
  });
});
//update strickNum in user count table
router.post("/update/countData/strickNum/:uid/:value", (req, res) => {
  countModel.find({ userId: req.params.uid }).exec((err, data) => {
    if (err) throw err;
    const value = req.params.value;
    countModel.updateOne(
      { userId: req.params.uid },
      { strickNum: parseInt(data[0].strickNum) + parseInt(value) },
      (err2, data2) => {
        if (err2) throw err2;
        res.send(`Your data is updated`);
      }
    );
  });
});

module.exports = router;
