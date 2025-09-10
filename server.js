const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const selfsigned = require('selfsigned');
const path = require("path");
const fs = require('fs');
const https = require('https');

const port = process.env.PORT || 5000;
// app.listen(port,()=>{
//     console.log(`app listening the port:${port}`);
// });

app.use("/api/token", require("./routes/tokenRoutes"));

app.use(express.static(path.join(__dirname,"public")));

// Path to save cert files
const sslDir = path.join(__dirname, 'ssl');
if (!fs.existsSync(sslDir)) fs.mkdirSync(sslDir);

// Generate self-signed certificate
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

// Save cert and key to disk (optional)
fs.writeFileSync(path.join(sslDir, 'cert.pem'), pems.cert);
fs.writeFileSync(path.join(sslDir, 'key.pem'), pems.private);
console.log('Self-signed cert generated!');

// Start HTTPS server using generated cert
const options = {
  key: pems.private,
  cert: pems.cert
};

https.createServer(options, app).listen(5001, () => {
  console.log('HTTPS server running on https://localhost:5001');
});

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "index.html"));
})
