require("dotenv").config();
require("express-async-errors");
const express = require('express');
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/songs");
const playlistRoutes = require("./routes/playlist");
const searchRoutes = require("./routes/search");
// const connection =require("./db");
// const mongoose = require('mongoose');
// try{
// mongoose.connect('mongodb+srv://pranil:Vansh2709@cluster0.cjwayym.mongodb.net/musixonDB',{useNewUrlParser:true, useUnifiedTopology:true});
// console.log("Connected");
// }
// catch(err){
//   console.log("not connected");
// }
const app = express();

 connection();

 app.set("view engine","ejs");
 app.use(express.static("public"));
app.use(cors());
app.use(express.json());

app.use("/api/users",userRoutes);
app.use("/api/login",authRoutes);
app.use("/api/songs",songRoutes);
app.use("/api/playlists",playlistRoutes);
app.use("/api/",searchRoutes);

// app.post("/api/user",function(req,res){
//   console.log(req.body);
//   req.send(req.body);
// })

app.get("/",function(req,res){
  res.render("signup")
})

const port =process.env.PORT||8080;
app.listen(port,console.log(`Listening on ${port}..`));
