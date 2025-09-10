const express = require("express");
const router = express.Router();
const dotenv = require("dotenv").config();
const {getToken} = require("../controllers/tokenController.js");

router.get("/",getToken);

module.exports = router;
