import express from "express";
import initAPIRoute from "./route/api";
const cors = require('cors');

const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");

const Sequelize = require('sequelize');
const XLSX = require('xlsx');
const multer = require('multer');
require("dotenv").config();
var morgan = require("morgan");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;


const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, 
  optionsSuccessStatus: 204,
};

const secretKey = "doantruong";

app.use(cors(corsOptions));
app.use(express.static("./src/public"));

app.use(express.urlencoded({ extended: true })); // MiddleWare
app.use(express.json()); // MiddleWare

app.use((req, res, next) => {
  next();
});

  // Middleware để xác thực token
  const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ success: false, message: "Access denied" });
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).json({ success: false, message: "Invalid token" });
  
      // Lưu thông tin người dùng từ token vào request để sử dụng ở các route khác
      req.user = user;
      next();
    });
  };
  
  // Route yêu cầu token để truy cập
  app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({ success: true, message: "Protected route", user: req.user });
  });

initAPIRoute(app);

app.listen(port, () => console.log(`Examples at http://localhost:${port}`));
