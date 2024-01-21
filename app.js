 require("dotenv").config();
 const express = require("express");
 const app = express();
 const requestRoutes = require("./Routes/request");
 const bodyParser = require("body-parser");

 app.use(express.static("public"));
 app.use(express.json());
 app.use("/",requestRoutes);

console.log(process.env.PORT)
 app.listen(process.env.PORT,() =>{
    console.log("Server is running");
 })

 app.get("/",(req,res) =>{
    console.log(__dirname + "/index.html");
    res.sendFile(__dirname + "/index.html");
 });
