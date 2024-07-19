const jwt= require("jsonwebtoken");
const userModel = require("../models/user-model");


module.exports.isLoggedin = async function(req,res,next){
    if(req.cookies.token === "")
        {
            res.redirect('/');
        }
    else 
        {
            try 
            {
                let decoded=jwt.verify(req.cookies.token,process.env.JWT_KEY);
                // console.log(decoded);
                let user = await userModel.findOne({email:decoded.email});
                // console.log(user);
                req.user= user;
                next();
    
            }
            catch(err)
            {
                res.redirect("/");
            }
        }
}

module.exports.redirectToprofile = async function(req,res,next){
    if(req.cookies.token)
        {
          try 
          {
            let decoded = jwt.verify(req.cookies.token,process.env.JWT_KEY);
            if(decoded)
                {
                    return res.redirect("/profile");
                }
          }
          catch (err)
          {
            return next();
          }
        }
    else
    {
        return next();
    }    
}

