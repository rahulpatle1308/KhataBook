const mongoose= require("mongoose");


mongoose.connect("mongodb+srv://vikasrahangdale89:Vikash123@cluster0.p1r7d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(function(){
    console.log("connected to database");
})

module.exports = mongoose.connection;