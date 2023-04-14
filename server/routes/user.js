const express = require('express');
const router = express.Router();
const user  = require('../controllers/user');
const authUser = require("../middleware/auth");
const path = require("path");

const multer = require('multer');
const { v4 : uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/userImages');
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

// Admin, HOD, Faculty, Student
router.post("/addUser",uploadImage , user.signUp);

router.post("/loginUser", user.signIn);

router.get("/getUserProfile",authUser, user.getUserProfile);

router.get("/getUserProfileById/:id",authUser, user.getUserProfileById);

router.put("/changePassword", authUser, user.changePassword);

router.put("/updateUserProfile",authUser,uploadImage,user.updateUserProfile);

router.put("/updateProfileImage/:id",authUser,uploadImage,user.updateProfileImage);

router.get("/logout",authUser, user.logout);


// Admin
router.get("/getAllUser",authUser, user.getAllUser);

router.put("/updateUserById/:id", authUser, uploadImage,user.updateUserById);

router.delete("/deleteUser/:id",authUser,user.deleteUser);

router.get("/roleWiseUserList",authUser, user.roleWiseUserList);

router.get("/roleWiseUserName",authUser, user.roleWiseUserName);


module.exports = router;