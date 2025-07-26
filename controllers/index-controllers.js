const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user-model");
const { use } = require("../routes/indexRouter");



module.exports.loginController = function (req, res) {
    res.render("index", { isLoggedin: false, error: req.flash("error") });
}

module.exports.registerController = function (req, res) {
    res.render("register", { isLoggedin: false, error: req.flash("error") });
}


module.exports.registerPostController = async function (req, res) {
  const { name, username, email, password } = req.body;

  // Field validation
  if (!name || !username || !email || !password) {
    req.flash("error", "All fields are required");
    return res.redirect("/register");
  }

  if (name.length < 3) {
    req.flash("error", "Name must be at least 3 characters long");
    return res.redirect("/register");
  }

  if (username.length < 3) {
    req.flash("error", "Username must be at least 3 characters long");
    return res.redirect("/register");
  }

  if (password.length < 4) {
    req.flash("error", "Password must be at least 4 characters long");
    return res.redirect("/register");
  }

  try {
    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email is already registered");
      return res.redirect("/register");
    }

    // Check if username already exists
    const existingUsername = await userModel.findOne({ username });
    if (existingUsername) {
      req.flash("error", "Username is already taken");
      return res.redirect("/register");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await userModel.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, userid: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    // Set token in cookie
    res.cookie("token", token, { httpOnly: true });

    // Redirect to home
    return res.redirect("/");
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error", "Something went wrong. Please try again later.");
    return res.redirect("/register");
  }
};

module.exports.loginPostController = async function (req, res) {
    let { email, password } = req.body;

    if (!email || !password) {
        req.flash("all fields are required")
        return res.redirect("/");
    }

    try {
        let user = await userModel.findOne({ email });
        if (!user) {
            req.flash("you have to registered first");
            return res.redirect("/");
        }
        let result = await bcrypt.compare(password, user.password);
        if (result) {
            let token = await jwt.sign({ email, userid: user._id }, process.env.JWT_KEY);
            res.cookie("token", token);
            return res.redirect("/profile");
        }
        else {
            req.flash("Email or password is incorrect");
            res.redirect('/');
        }



    }
    catch (err) {
        req.flash("error", "something happen error 404");
        return res.redirect("/");
    }
}

module.exports.logoutControllers = async function (req, res) {
    res.cookie("token", "");
    res.redirect("/");
}

module.exports.profileControllers = async function (req, res) {

    let byDate = Number(req.query.byDate);
    let { startDate, endDate } = req.query;

    byDate = byDate ? byDate : -1;
    startDate = startDate ? startDate : new Date("1980-01-01");
    endDate = endDate ? endDate : new Date();

    let user = await userModel.findOne({ email: req.user.email }).populate({
        path: "hisaabs",
        match: { createdAt: { $gte: startDate, $lte: endDate } },
        options: { sort: { createdAt: byDate } }
    });
    res.render("profile", { user: user, error: req.flash("error") });
}


