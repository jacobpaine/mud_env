var express = require("express");
var app = express();
var router = express.Router();
var fs = require("fs");
var multer = require("multer");
var upload = multer({dest: "./uploads"});
var mongoose = require("mongoose");
var conn = mongoose.connection;
var gfs;
var Grid = require("gridfs-stream");

conn.once("open", function(){
  gfs = Grid(conn.db);

  router.get("/", function(req,res){
    //renders a multipart/form-data form
    res.render("index");
  });

  router.get("/home", function(req,res){
    //renders a multipart/form-data form
    res.render("home");
  });

  router.get("/rooms", function(req, res, next) {
    conn.db.collection("rooms").find({}).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get rooms.");
      } else {
        res.status(200).json(docs);
      }
    });
  });

  //second parameter is multer middleware.
  router.post("/", upload.single("avatar"), function(req, res, next){
    //create a gridfs-stream into which we pipe multer's temporary file saved in uploads. After which we delete multer's temp file.
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname
    });
    //
    // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
    fs.createReadStream("./uploads/" + req.file.filename)
      .on("end", function(){fs.unlink("./uploads/"+ req.file.filename, function(err){res.send("success")})})
        .on("err", function(){res.send("Error uploading image")})
          .pipe(writestream);
  });

  // sends the image we saved by filename.
  router.get("/:filename", function(req, res){
      var readstream = gfs.createReadStream({filename: req.params.filename});
      readstream.on("error", function(err){
        res.send("No image found with that title");
      });
      readstream.pipe(res);
  });

  //delete the image
  router.get("/delete/:filename", function(req, res){
    gfs.exist({filename: req.params.filename}, function(err, found){
      if(err) return res.send("Error occured");
      if(found){
        gfs.remove({filename: req.params.filename}, function(err){
          if(err) return res.send("Error occured");
          res.send("Image deleted!");
        });
      } else{
        res.send("No image found with that title");
      }
    });
  });

  // update the lights
  router.put("/rooms/:roomname", function(req, res, next) {
    var updateDoc = req.body;
    delete updateDoc._id;

    conn.db.collection("rooms").updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, docs) {
      res.send('PUT request happens')
      if (err) {
        handleError(res, err.message, "Failed to get rooms.");
      } else {
        res.status(204).json(docs);
      }
    });
  });
  //
  // app.put("/contacts/:id", function(req, res) {
  //   var updateDoc = req.body;
  //   delete updateDoc._id;
  //
  //   db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
  //     if (err) {
  //       handleError(res, err.message, "Failed to update contact");
  //     } else {
  //       res.status(204).end();
  //     }
  //   });
  // });




});

module.exports = router;
