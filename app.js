const express = require("express");
const path = require("path");
const app = express();
const apiRouter = require("./route/api");
const uploadsRouter = require("./route/uploads");

const fileUpload = require("express-fileupload");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use((req, res, next) => {
  // api access by origin
  res.setHeader("Access-Control-Allow-Origin", "*"),
    res.setHeader("Access-Control-Allow-Headers", "*"),
    next();
});
app.use("/api", apiRouter);
app.use("/uploads", uploadsRouter);

// router
app.get("/", (req, res) => {
  res.send("auth service backend prepared");
});

// listen
app.listen(process.env.PORT || 5000, () =>
  console.log(`server is lisning at ${process.env.PORT || 5000}`)
);
