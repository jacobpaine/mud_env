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

mongoose.connect("process.env.MONGODB_URI" || "mongodb://localhost/mud_env");
Grid.mongo = mongoose.mongo;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.set("view engine", "ejs");
app.set("views", "./views");

if (!module.parent) {
  app.listen(3000);
}
