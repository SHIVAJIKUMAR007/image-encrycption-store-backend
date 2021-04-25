const express = require("express");
const router = express.Router();
const { userModel, countModel } = require("../db");
const bcrypt = require("bcrypt");
const e = require("express");
const { ffService } = require("../axios");

router.get("/betContributors", (req, res) => {
  userModel.find({}).exec((err, data) => {
    if (err) throw err;
    const time = Date.now();
    const ans = data.sort((a, b) => {
      return (
        b.creditScore / (time - b.timeOfSignUP) -
        a.creditScore / (time - a.timeOfSignUP)
      );
    });
    ans.slice(0, 50);
    res.send(ans);
  });
});

router.get("/followSuggetions/:uid", async (req, res) => {
  let following = await (await ffService.get(`/following/${req.params.uid}`))
    .data;
  const time = Date.now();
  userModel.findById(req.params.uid, (err, user) => {
    if (err) throw err;
    following = [...following, user];
    // is user a aspirant or a student or alumuni
    if (user.collageStatus === "aspirant") {
      const collageOfInterest = user.collageOfInterest;
      const ans = new Array();
      collageOfInterest.length
        ? collageOfInterest.map((collage, i) => {
            userModel
              .find({
                collageShort: { $regex: collage },
              })
              .exec((err2, data2) => {
                if (err2) throw err2;
                // const len = data2.length;
                // data2 = data2.slice(0, len);
                ans = [...ans, ...data2];
                if (i === collageOfInterest.length - 1) {
                  ans = [...new Set(...ans)];
                  ans = ans.filter((item) => !following.includes(item));
                  ans.sort((a, b) => {
                    return (
                      b.creditScore / (time - b.timeOfSignUP) -
                      a.creditScore / (time - a.timeOfSignUP)
                    );
                  });
                  res.send(ans);
                }
              });
          })
        : res.send([]);
    } else {
      userModel
        .find({
          collageShort: { $regex: user.collageShort },
        })
        .exec((err2, data2) => {
          if (err2) throw err2;
          // const len = data2.length;
          // data2 = data2.slice(0, len / 3);
          data2 = data2.filter((item) => !following.includes(item));
          data2.sort((a, b) => {
            return (
              b.creditScore / (time - b.timeOfSignUP) -
              a.creditScore / (time - a.timeOfSignUP)
            );
          });
          res.send(data2);
        });
    }
  });
});

module.exports = router;
