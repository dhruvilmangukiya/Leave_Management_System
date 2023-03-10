const db = require("../database/config");
const User = db.user;
const Boom = require("@hapi/boom");
const { messages } = require("../utils/message");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// delete file
function deleteFile(image) {
    const imagePath = path.join(__dirname, "../images/");
    fs.unlinkSync(imagePath + image);
}

module.exports.signUp = async (req, res, next) => {
    try{
        const data = req.body;
        data.image = req.file.filename;

        const isUserExists = await User.findOne({ where : {email:data.email} });
        if (isUserExists) {
            deleteFile(data.image)
            return next(Boom.badData(messages.RECORD_ALREADY_EXISTS));
        }

        const user = await User.create(data);

        res.status(201).json({
            statusCode: 201,
            message: 'User created successfully',
            result: user
        });
    }catch(error){
        return next(Boom.badData(error));
    }
};

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
                user_email: user.email
            }, process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        res.status(200).json({
            statusCode:200,
            message: "Login Successfully", token: token
        });
    }
    catch(error){
        console.log(error);
        return next(Boom.badImplementation());
    }
};

module.exports.getUsersDetails = async (req, res, next) => {
    try{
        const users = await User.findAll({
            attributes:{
                exclude:['password']
            }
        });
        res.status(200).json({
            statusCode: 200,
            result: users || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

module.exports.getProfileDetails = async (req, res, next) => {
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
            statusCode: 200,
            result: user
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

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
                statusCode: 422,
                message: "New Password And Confirm Password Not Match" 
            });
        } 
        
        const newHashPwd = await bcrypt.hash(data.newpwd,10);
        await User.update({password:newHashPwd}, {where : { id }});

        res.status(200).json({ 
            statusCode: 200,
            message: "Password Changed Successfully" 
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

module.exports.updateUserDetails = async (req, res, next) => {
    try{
        const { id } = req.params;
        const data = req.body;

        let user = await User.findOne({where :{ id }});
        
        if(!user) return next(Boom.badData(messages.RECORD_NOT_FOUND));

        const schema = Joi.object().keys({
            name: Joi.string().required(),
            gender: Joi.string().required(),
            phone: Joi.string().required(),
            address: Joi.string().required(),
            department: Joi.string().required(),
            class: Joi.string().required(),
        });

        const {error} = schema.validate(data);

        if (error) return next(Boom.badData(error.message));

        if(req.file){
            deleteFile(user.image);
        }

        let updateImg;
        updateImg = req.file ? req.file.filename : user.image;

        await User.update({
            name : data.name, 
            gender : data.gender, 
            phone : data.phone, 
            address: data.address,
            department: data.department,
            class: data.class,
            image : updateImg,
            updatedAt:new Date()
        }, 
        {
            where :{ id }
        });

        user = await User.findOne({where :{ id }});
        res.status(200).json({
            statusCode: 200,
            message: `User ${id} updted successfully`,
            result: user
        });
    }
    catch(error){
        req.file ? deleteFile(req.file.filename) : "";
        return next(Boom.badImplementation());
    }
}
