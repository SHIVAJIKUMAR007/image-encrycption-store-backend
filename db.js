const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://shivaji:Shivaji@007@cluster0.narig.mongodb.net/issDb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);
// "mongodb://localhost:27017/issDb"
// "mongodb+srv://shivaji:Shivaji@007@cluster0.narig.mongodb.net/issDb?retryWrites=true&w=majority"

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  profilePic: String,
  signUpProcess: Boolean,
});

const userModel = mongoose.model("users", userSchema);

const mediaSchema = mongoose.Schema({
  userId: String,
  mediaData: String,
});
const mediaModal = mongoose.model("medias", mediaSchema);
module.exports = { userModel, mediaModal };
