const db = require("../database/config");
const LeaveRequest = db.leaveRequest;
const Boom = require("@hapi/boom");
const { messages } = require("../utils/message");

module.exports.leaveRequest = async (req, res, next) => {
    try{
        console.log("hello");
        const data = req.body;

        
    }catch(error){
        return next(Boom.badData(error));
    }
};