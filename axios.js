const axios = require("axios");

const authService = axios.create({
  baseURL: "http://localhost:5000/api/",
});

const ffService = axios.create({
  baseURL: "http://localhost:5010/api/",
});

const massageService = axios.create({
  baseURL: "http://localhost:5020/api/",
});

const newsFeedService = axios.create({
  baseURL: "http://localhost:5030/api/",
});

const postService = axios.create({
  baseURL: "http://localhost:5040/api/",
});

const quansService = axios.create({
  baseURL: "http://localhost:5050/api/",
});

const reportService = axios.create({
  baseURL: "http://localhost:5060/api/",
});

const notificationService = axios.create({
  baseURL: "http://localhost:5070/api/",
});
const notifySocket = "http://localhost:5070/";
module.exports = {
  authService,
  ffService,
  massageService,
  newsFeedService,
  postService,
  quansService,
  reportService,
  notificationService,
  notifySocket,
};
