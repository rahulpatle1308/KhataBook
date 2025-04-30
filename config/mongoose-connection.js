const mongoose= require("mongoose");


mongoose.connect("mongodb://127.0.0.1:27017/database_name").then(function(){
    console.log("connected to database");
})

module.exports = mongoose.connection;