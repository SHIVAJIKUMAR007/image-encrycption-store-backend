const axios = require("axios");

const authService = axios.create({
  baseURL: "https://matescon-auth-service.herokuapp.com/api/",
});

const ffService = axios.create({
  baseURL: "https://matescon-ffservice.herokuapp.com/api/",
});

const massageService = axios.create({
  baseURL: "https://matescon-massage.herokuapp.com/api/",
});

const newsFeedService = axios.create({
  baseURL: "https://matescon-newsfeed.herokuapp.com/api/",
});

const postService = axios.create({
  baseURL: "https://matescon-postservice.herokuapp.com/api/",
});

const quansService = axios.create({
  baseURL: "https://matscon-quans.herokuapp.com/",
});

const reportService = axios.create({
  baseURL: "https://matescon-report.herokuapp.com/capi/",
});
const notificationService = axios.create({
  baseURL: "https://matescon-notification.herokuapp.com/api/",
});

const profilePic = "https://matescon-auth-service.herokuapp.com/";
const postAssest = "https://matescon-postservice.herokuapp.com/";
const notifiSocket = "https://matescon-notification.herokuapp.com/";
const massageSocket = "https://matescon-massage.herokuapp.com/";
module.exports = {
  authService,
  ffService,
  massageService,
  newsFeedService,
  postService,
  quansService,
  reportService,
  notificationService,
  profilePic,
  postAssest,
  notifiSocket,
  massageSocket,
};
