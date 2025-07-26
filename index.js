// const express = require("express");
// const { env } = require("process");
// const app = express();
// const cookieparser = require("cookie-parser");

// require('dotenv').config();

// const indexRouter = require("./routes/indexRouter");
// const hisaabRouter = require("./routes/hisaabRouter");
// const db = require("./config/mongoose-connection");
// const path = require("path");

// const flash = require("connect-flash");
// const expressSession = require("express-session");

// app.use(expressSession({
//     secret: 'anmolpandey', 
//     resave: false,
//     saveUninitialized: true
// }));

// app.use(flash());

// app.set("view engine","ejs");
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(express.static(path.join(__dirname,"public")));
// app.use(cookieparser());

// app.use("/",indexRouter);
// app.use("/hisaab",hisaabRouter);


// process.on('uncaughtException',()=>{
//     console.log("errorr")
// })

// app.listen(process.env.PORT);


// index.js

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");

// Load env variables
dotenv.config();

// Database connection
require("./config/mongoose-connection"); // बस connect कर रहा है, कुछ return नहीं कर रहा

// Routes
const indexRouter = require("./routes/indexRouter");
const hisaabRouter = require("./routes/hisaabRouter");

// App setup
const app = express();

// Session and Flash
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultSecret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Middlewares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Routes
app.use("/", indexRouter);
app.use("/hisaab", hisaabRouter);

// Global Error Handler (for uncaught exceptions)
process.on('uncaughtException', (err) => {
    console.error("Uncaught Exception:", err);
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
