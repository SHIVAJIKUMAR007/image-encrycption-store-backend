const express = require("express");
const router = express.Router();
const { mediaModal } = require("../db");
const path = require("path");

router.get("/all_media/:userId/:pageNumber/:nPerPage", (req, res) => {
  console.log("yes");
  if (req.params.userId) {
    let nPerPage = parseInt(req.params.nPerPage);
    let pageNumber = parseInt(req.params.pageNumber);
    nPerPage = nPerPage > 10 ? 10 : nPerPage;
    try {
      mediaModal
        .find({ userId: req.params.userId })
        .sort({ _id: 1 })
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage)
        .exec((err, data) => {
          if (err) throw err;
          res.send({ status: 1, data: data, msg: "data found." });
        });
    } catch (error) {
      res.send({ status: 0, msg: "error in db query" });
    }
  } else res.send({ status: 0, msg: "user not exist" });
});

router.get("/one_media/:mediaId", (req, res) => {
  let mediaId = req.params.mediaId;
  try {
    mediaModal.find({ _id: mediaId }).exec((err, data) => {
      if (err) throw err;
      res.send({ status: 1, data: data[0], msg: "data found." });
    });
  } catch (error) {
    res.send({ status: 0, msg: "error in db query" });
  }
});

router.post("/one_media", (req, res) => {
  let { userId, mediaData } = req.body;
  if (userId) {
    try {
      mediaModal.create(
        {
          userId,
          mediaData,
        },
        (err, resp) => {
          if (err) throw err;
          res.send({
            status: 1,
            msg: "Media uploaded.",
            data: resp,
          });
        }
      );
    } catch (error) {
      res.send({ status: 0, msg: "error in db query" });
    }
  } else {
    res.send({ status: 0, msg: "user is not provided" });
  }
});

module.exports = router;
