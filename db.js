const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://shivaji:Shivaji@007@cluster0.narig.mongodb.net/authServiceDb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

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
