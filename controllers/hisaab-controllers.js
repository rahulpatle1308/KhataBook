
const { request } = require("express");
let hisaabModel = require("../models/hisaab-model");
const userModel = require("../models/user-model");
const {v4:uuidv4} = require("uuid");

module.exports.hisaabPageControllers = async function(req,res){
    res.render("create", {error:req.flash("error")});
}

module.exports.hisaabCreateControllers = async function(req,res){
    // res.send("helyoo");
    let {title,description,shareable,editpermissions,passcode,encrypted} = req.body;

      
    if(!title || !description ){
        req.flash("error","title and description are required");
        return res.redirect("/hisaab/create");
    }

    shareable = shareable === "on" ? true : false;
    editpermissions = editpermissions === "on" ? true : false;
    encrypted = encrypted === "on" ? true : false;

    if(encrypted){
        if(!passcode){
            req.flash("error","passcode is required");
            return res.redirect("/hisaab/create");
            
        }
    }
    
    let hisaab = await hisaabModel.create({
        description,
        title,
        editpermissions,
        shareable,
        encrypted,
        passcode,
        user:req.user._id
    });

    req.user.hisaabs.push(hisaab._id);
    await req.user.save();
    res.redirect("/profile");
}

module.exports.hisaabViewControllers = async function (req, res) {
    
    let hisaab = await hisaabModel.findOne({_id:req.params.id});

    if(hisaab.encrypted){
        return res.render("passcode",{hisaab,error:req.flash("error")});
    }
    else{
        return  res.render("hisaab",{hisaab});
    }
}

module.exports.passcodeVerifyControllers = async function (req, res) {
    let {passcode} = req.body;

    let hisaab = await hisaabModel.findOne({_id:req.params.id});
    if(hisaab.passcode === passcode){
        req.session.verifiedHisaab = hisaab;
        return res.redirect("/hisaab/view");
    }
    else{
        req.flash("error","incorrect passcode");
        return res.redirect(`/hisaab/view/${req.params.id}`);
    }
 }

 module.exports.hisaabShowControllers = async function(req,res){
    const verifiedUser = req.session.verifiedHisaab;

let hisaab = await hisaabModel.findOne({_id:verifiedUser._id});
console.log(hisaab);

    if(!verifiedUser){
        req.flash("error","hisaab not found");
        return res.redirect("/profile");
    }

    res.render("hisaab",{hisaab});
    req.session.verifiedHisaab = null;
 }
 module.exports.hisaabDeleteControllers = async function (req, res) {
    let hisaab = await hisaabModel.findById(req.params.id);
    if(!hisaab){
        req.flash("error","hisaab not found");
     return res.redirect("/profile");   
    }
    hisaab = await hisaabModel.deleteOne({_id:req.params.id,});
    
   return res.redirect("/profile");
 }

 module.exports.hisaabEditControllers = async function (req, res) {

    let hisaab = await hisaabModel.findOne({_id:req.params.id});
    res.render("edit",{hisaab,error:req.flash("error")});
 }

 
 module.exports.hisaabPostEditControllers = async function (req, res) {
    let {title,description,shareable,editpermissions,passcode,encrypted} = req.body;
    
    // if(!title || !description ){
    //     req.flash("error","title and description are required");
    //     return res.redirect("/hisaab/create");
    // }

    shareable = shareable === "on" ? true : false;
    editpermissions = editpermissions === "on" ? true : false;
    encrypted = encrypted === "on" ? true : false;
    if(encrypted){
        if(!passcode){
            req.flash("error","passcode is required");
            return res.redirect(`/hisaab/edit/${req.params.id}`);
        }
    }
    let hisaab = await hisaabModel.findOneAndUpdate({_id:req.params.id},{title,description,editpermissions,encrypted,passcode,shareable});
    res.redirect("/profile");
 }

