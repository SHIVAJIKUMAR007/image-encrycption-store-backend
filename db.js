const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/authServiceDb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  bio: String,
  profilePic: String,
  signUpProcess: Boolean,
  collageStatus: String,
  passingYear: Number,
  collageOfInterest: Array,
  collageFull: String,
  collageShort: String,
  creditScore: Number,
  timeOfSignup: Date,
});

// postNum: Number,
// queNum: Number,
// ansNum: Number,
// strickNum: Number,

const userModel = mongoose.model("users", userSchema);

const countSchema = mongoose.Schema({
  userId: String,
  followers: Number,
  following: Number,
  postNum: Number,
  queNum: Number,
  ansNum: Number,
  strickNum: Number,
});
const countModel = mongoose.model("counts", countSchema);
module.exports = { userModel, countModel };
