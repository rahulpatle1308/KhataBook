const mongoose= require("mongoose");


mongoose.connect("mongodb://0.0.0.0:27017/khatabookn19").then(function(){
    console.log("connected to database");
})

module.exports = mongoose.connection;