const fetch = require("node-fetch"); // npm install node-fetch@2
require("dotenv").config();
const jwttoken = require("jsonwebtoken");
const uuid4 = require('uuid4');

const getToken = async(req,res) =>{
  console.log("inside the getToken()");
  try {
    const options = {
      // expiresIn: '6h',  // Token valid for 6 hours (adjust as needed)
      algorithm: 'HS256'
    };

    const payload = {
      apikey: process.env.API_KEY,  // Note: 'apikey' (lowercase) instead of 'apiKey'
      permissions: ['allow_join',"publish", "allow_mod"],  // Correct, as strings
      version: 2,  // Required for v2 API endpoints like /v2/rooms
      iat: Math.floor(Date.now() / 1000), // Current time in seconds
      exp: Math.floor(Date.now() / 1000) + 360000 
    };
    console.log("value of the payload and options",payload,options,Date.now());
    
    const token = jwttoken.sign(payload, process.env.SECRET_KEY, options);
    console.log("Generated Token:", token);

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error generating token:", err);
    res.status(500).json({ error: "Failed to generate token" });
  }
};
module.exports = { getToken };