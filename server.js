const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Basic Configuration
const port = process.env.PORT;

const mongoose = require('mongoose')

const mongoDbUser = process.env.MONGODB_USER
const mongoDbPw = process.env.MONGODB_PW
const mongoDbName = process.env.MONGODB_NAME
const mongoUri = `mongodb+srv://${mongoDbUser}:${mongoDbPw}@${mongoDbName}`

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))

// Serve the public directory
app.use('/public', express.static(process.cwd() + '/public'));

// Serve the index to the root route
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});