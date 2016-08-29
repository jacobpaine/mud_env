var express = require("express");
var app = express();
var fs = require("fs");
var multer = require("multer");
var upload = multer({dest: "./uploads"});
var mongoose = require("mongoose");
var routes = require('./routes/index');
var conn = mongoose.connection;
var gfs;
var Grid = require("gridfs-stream");
var path = require('path');
var url = process.env.MONGODB_URI || "mongodb://localhost/mud_env";
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

mongoose.connect(url);
Grid.mongo = mongoose.mongo;
app.use('/', routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.set("view engine", "ejs");
app.set("views", "./views");

// if (!module.parent) {
//   app.listen(3000);
// }
var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});
