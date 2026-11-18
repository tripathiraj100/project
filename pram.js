const express = require("express");
const napp = express;
const mongoose = require("mongoose");

napp.listen(5555 , () =>{
    console.log("server is listening to the port 5555");
});