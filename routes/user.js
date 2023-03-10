const express = require('express');
const router = express.Router();
const user  = require('../controllers/user');
const auth = require("../middleware/auth");
const path = require("path");

const multer = require('multer');
const { v4 : uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const uploadImage = multer({
storage: storage,
fileFilter: (req, file, cb) => {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
      cb(null, true);
    } else{
      cb(null, false);
      return cb(new Error("Only .png, .jpg, and .jpeg File Format Allowed...!"));
    } 
},
    
}).single('image');

router.post("/addUser",uploadImage, user.signUp);

router.post("/loginUser", user.signIn);

// router.get("/getAllUser",auth, user.getUsersDetails);

router.get("/getProfileDetails/:id",auth, user.getProfileDetails);

router.post("/changePassword", auth, user.changePassword);

router.patch("/updateUserDetails/:id",auth,uploadImage,user.updateUserDetails);

module.exports = router;