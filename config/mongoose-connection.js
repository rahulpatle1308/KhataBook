// const mongoose= require("mongoose");


// mongoose.connect(process.env.mongoose_url).then(function(){
//     console.log("connected to database");
// })

// module.exports = mongoose.connection;


// config/mongoose-connection.js



const mongoose = require("mongoose");
require("dotenv").config(); // सुनिश्चित करें कि env variables लोड हो चुके हैं

const mongoURL = process.env.MONGO_URL;

if (!mongoURL) {
    console.error("❌ MONGO_URL is not defined in .env file.");
    process.exit(1);
}

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ Connected to MongoDB");
})
.catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
});

module.exports = mongoose.connection;
