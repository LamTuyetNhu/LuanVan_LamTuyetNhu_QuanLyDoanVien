import express from "express";
// import initWebRoute from "./configs/viewEngine";
// import configViewEngine from "./route/web";
import initAPIRoute from "./route/api";
const cors = require('cors');

const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const XLSX = require('xlsx');
const multer = require('multer');
require("dotenv").config();
var morgan = require("morgan");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;



// Cấu hình tùy chọn CORS
const corsOptions = {
  origin: "http://localhost:3000", // Thay thế bằng tên miền của trang frontend của bạn
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Nếu bạn sử dụng phiên đăng nhập
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Hỗ trợ lấy data từ client về server
app.use(express.urlencoded({ extended: true })); // MiddleWare
app.use(express.json()); // MiddleWare

/* Vi du muon xem thong tin tu phia client */
app.use((req, res, next) => {
  // console.log(">>> RUN INTO MY MIDDLEWARE");
  // console.log(req); //lay tat ca thong tin
  // console.log(req.header); //Muon lay ip nguoi dung
  // console.log(req.method);
  next();
});

//Setup view engine
// configViewEngine(app);

//init web route
// initWebRoute(app);

//init API route
initAPIRoute(app);

//handle 404 not found
// app.use((req, res) => {
  // MiddleWare
  // return res.render("404.ejs");
// });

app.listen(port, () => console.log(`Examples at http://localhost:${port}`));
