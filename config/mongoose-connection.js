const mongoose= require("mongoose");


mongoose.connect(process.env.mongoose_url).then(function(){
    console.log("connected to database");
})

module.exports = mongoose.connection;