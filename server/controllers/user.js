const User = require('../models').users;
const Role = require('../models').roles;
const UserLeaveModel = require('../models').userLeaveModels;
const { Op } = require('sequelize');

const Boom = require("@hapi/boom");
const { messages } = require("../utils/message");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");

function deleteFile(image) {
    const imagePath = path.join(__dirname, "../public/userImages/");
    fs.unlinkSync(imagePath + image);
}

// Signup Hod, Faculty, Student 
module.exports.signUp = async (req, res, next) => {
    try{
        const data = req.body;
        delete data.cpassword;
        data.image = req.file ? req.file.filename : '';
        data.grNumber = data.grNumber ? data.grNumber : '';
        data.class = data.class ? data.class : '';
        data.department = data.department ? data.department : '';

        const isEmailExists = await User.findOne({ where :{ email: data.email }});
        const isgrNumberExists = await User.findOne({ where :{ grNumber: data.grNumber }});
        const isPhoneExists = await User.findOne({ where :{ phone: data.phone }});

        if (isEmailExists) {
            data.image ? deleteFile(data.image) : '';
            return next(Boom.badData(messages.RECORD_ALREADY_EXISTS));
        }

        if(isgrNumberExists){
            data.image ? deleteFile(data.image) : '';
            return next(Boom.badData('Gr Number already in use'));
        }

        if(isPhoneExists){
            data.image ? deleteFile(data.image) : '';
            return next(Boom.badData('Phone Number already in use'));
        }

        // User signup
        const user = await User.create(data);

        // User Leave By default create record
        const userLeave = await UserLeaveModel.create({ userId: user.id });

        // Email Sending
        const subject = "Please Logged in Leave Management System";
        const dataHtml = `<h1>Please Login Our Leave Management System</h1><br/>
                        <p>Dear ${data.name}</p><br/>
                        <p>You are successfully registered in Leave Management System</p><br/>
                        <p>Please enter the below mentioned email and password for logging into Leave Management System</p><br/>
                        <p>Email : ${data.email}</p>
                        <p>Password : ${data.password}</p>
                        <p>Thank you</p><br/>
                        <p>Best regards</p>
                        <p>Leave Management System</p><br/>`
                        
        sendEmail(data.email, subject, dataHtml);

        res.status(201).json({
            message: 'User Registration Successfully',
            result: { user, userLeave }
        });
    }catch(error){
        req.file ? deleteFile(req.file.filename) : "";
        return next(Boom.badImplementation());
    }
};

// Login Admin, Hod, Faculty, Student
module.exports.signIn = async (req, res, next) => {
    try{
        const data = req.body;

        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const { error } = schema.validate(data);

        if(error) return next(Boom.badData(error.message));

        const user = await User.findOne({ 
            where : { email :data.email }
        });

        if(!user) return next(Boom.notFound(messages.RECORD_NOT_FOUND));

        if (!await bcrypt.compare(data.password, user.password)) {
            return next(Boom.unauthorized(messages.INVALID_CREDENTIALS));
        }

        // Create token
        const token = jwt.sign(
            { 
                user_id: user.id,
                user_email: user.email,
            }, process.env.TOKEN_KEY,
            {
                expiresIn: "12h",
            }
        );  

        res.cookie('access_token',token,{
            maxAge:900000,
            httpOnly:true
        });
        
        res.status(200).json({ 
            message: "Logged in successfully",
            token: token,
            data: user
        });
    }
    catch(error){
        return next(Boom.badImplementation());
    }
};

// All User Details Using Filter this is not use this project
module.exports.getAllUser = async (req, res, next) => {
    try{
        const { role } = req.query;

        const filter = {};
        filter.role = role;

        const users = await User.findAll({
            where: { role: filter.role },
            attributes:{
                exclude:['password']
            }
        });
        res.status(200).json({
            result: users || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// User Own Login Profile 
module.exports.getUserProfile = async (req, res, next) => {
    try{
        const id = req.user;
        const user = await User.findOne({
            where :{ id },
            attributes:{
                exclude:['password']
            }
        });

        if(!user) return next(Boom.badData(messages.RECORD_NOT_FOUND));
        
        res.status(200).json({
            result: user
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// Get profile by id 
module.exports.getUserProfileById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const user = await User.findOne({
            where :{ id },
            attributes:{
                exclude:['password']
            }
        });

        if(!user) return next(Boom.badData(messages.RECORD_NOT_FOUND));
        
        res.status(200).json({
            result: user
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// Change Password
module.exports.changePassword = async(req, res, next) => {
    try{
        const data = req.body;
        const id = req.user;

        const schema = Joi.object().keys({
            oldpwd: Joi.string().required(),
            newpwd: Joi.string().required(),
            cpwd: Joi.string().required(),
        })
        
        const { error } = schema.validate(data);

        if(error) return next(Boom.badData(error.message));

        const user = await User.findOne({ where : { id }});

        if(!await bcrypt.compare(data.oldpwd, user.password)) {
            return next(Boom.badData(messages.OLD_PWD_WRONG));
        }
        
        if(!(data.newpwd == data.cpwd)){
            return res.status(422).json({ 
                message: "New Password And Confirm Password Not Match" 
            });
        } 
        
        const newHashPwd = await bcrypt.hash(data.newpwd,10);
        await User.update({password:newHashPwd}, {where : { id }});

        res.status(200).json({ 
            message: "Password Changed Successfully" 
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// User Own Login Update Profile
module.exports.updateUserProfile = async (req, res, next) => {
    try{
        const id = req.user;
        const data = req.body;

        let user = await User.findOne({where :{ id }});
        
        if(!user) {
            req.file ? deleteFile(req.file.filename) : "";
            return next(Boom.badData(messages.RECORD_NOT_FOUND));
        }

        if(req.file){
            deleteFile(user.image);
        }

        data.image = req.file ? req.file.filename : user.image;

        await User.update(data,{ 
            where :{ id }
        });

        user = await User.findOne({
            where :{ id },
            attributes:{ exclude:['password'] }
        });

        res.status(200).json({
            message: `Profile updated successfully`,
            result: user
        });
    }
    catch(error){
        req.file ? deleteFile(req.file.filename) : "";
        return next(Boom.badImplementation());
    }
}

module.exports.updateProfileImage = async (req, res, next) => {
    try{
        const id = req.user;

        const profile = await User.findOne({where :{ id }});
        
        if(!profile) {
            req.file ? deleteFile(req.file.filename) : "";
            return next(Boom.badData(messages.RECORD_NOT_FOUND));
        }

        if(req.file){
            deleteFile(profile.image);
        }

        profile.image = req.file ? req.file.filename : profile.image;
        profile.save();

        res.status(200).json({
            message: `Profile Image Updated Successfully`,
            result: profile
        });
    }
    catch(error){
        req.file ? deleteFile(req.file.filename) : "";
        return next(Boom.badImplementation());
    }
}

// Admin All User Update Profile By Id
module.exports.updateUserById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const data = req.body;

        let user = await User.findOne({where :{ id }});
        
        if(!user) {
            req.file ? deleteFile(req.file.filename) : "";
            return next(Boom.badData(messages.RECORD_NOT_FOUND));
        }

        if(req.file){
            deleteFile(user.image);
        }

        data.image = req.file ? req.file.filename : user.image;

        await User.update(data,{
            where :{ id }
        });

        user = await User.findOne({
            where :{ id },
            attributes:{ exclude:['password'] }
        });

        res.status(200).json({
            message: `User Updted Successfully`,
            result: user
        });
    }
    catch(error){
        req.file ? deleteFile(req.file.filename) : "";
        return next(Boom.badImplementation());
    }
}

// Admin Delete All User
module.exports.deleteUser = async (req, res, next) => {
    try{
        const { id } = req.params;
        const user = await User.findOne({ where :{ id } });

        if(!user) return next(Boom.badData(messages.RECORD_NOT_FOUND));

        await User.destroy({where :{ id }});
        user.image ? deleteFile(user.image) : '';
        
        res.status(200).json({
            message: `User Deleted Successfully`
        });
    }
    catch(error){
        console.log(error);
        return next(Boom.badImplementation());
    }
}

// Admin All User List Role Wise
module.exports.roleWiseUserList = async (req, res, next) => {
    try{
        const user = await Role.findAll({ 
            attributes: ['id','name','priority'],
            include:{
                model: User
            },
            attributes:{
                exclude:['password']
            }
        });

        res.status(200).json({
            result: user || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    }   
}

// Admin show all user with role name
module.exports.roleWiseUserName = async (req, res, next) => {
    try{
        const user = await User.findAll({ 
            include:{
                model: Role,
                as: 'roles',
                attributes: ['name']
            },
            attributes:{
                exclude:['password']
            },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            result: user || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    }   
}

// Logout User
module.exports.logout = async (req, res, next) => {
    try{
        res.clearCookie("access_token");
        return res.status(200).json({ message: "Successfully logged out" });
    }catch(error){
        return next(Boom.badImplementation());
    }   
}