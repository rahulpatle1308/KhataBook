const express = require("express");
const router = express.Router();


const {isLoggedin,redirectToprofile}= require("../middlewares/index");
const { hisaabPageControllers,
       hisaabCreateControllers,
       passcodeVerifyControllers,
       hisaabViewControllers,
       hisaabDeleteControllers,
       hisaabEditControllers,
       hisaabPostEditControllers,
       hisaabShowControllers
    } = require("../controllers/hisaab-controllers");

router.get("/create",isLoggedin,hisaabPageControllers);
router.get("/view/:id",isLoggedin,hisaabViewControllers);
router.get("/delete/:id",isLoggedin,hisaabDeleteControllers);
router.get("/edit/:id",isLoggedin,hisaabEditControllers);
router.get("/view",isLoggedin,hisaabShowControllers);


router.post("/create",isLoggedin,hisaabCreateControllers);
router.post("/:id/verify",isLoggedin,passcodeVerifyControllers);
router.post("/edit/:id",isLoggedin,hisaabPostEditControllers);



module.exports = router;