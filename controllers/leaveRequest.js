const db = require("../database/config");
const LeaveRequest = db.leaveRequest;
const User = db.user;
const UserLeaveModel = db.userLeaveModel;
const Boom = require("@hapi/boom");
const { messages } = require("../utils/message");

module.exports.leaveRequest = async (req, res, next) => {
    try{
        const data = req.body;
        data.userId = req.user;
        const leaveData = await LeaveRequest.create(data);

        res.status(201).json({
            message: 'Leave created successfully',
            result: leaveData
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
};

module.exports.viewUserLeaveStatus = async (req, res, next) => {
    try{
        const userId = req.user;
        const userLeave = await LeaveRequest.findAll({
            where :{ userId }
        });

        res.status(200).json({
            result: userLeave || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    } 
};

module.exports.viewLeaveBalance = async (req, res, next) => {
    try{
        const userId = req.user;
        const userLeaveBalance = await UserLeaveModel.findAll({
            where :{ userId }
        });

        res.status(200).json({
            result: userLeaveBalance || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    } 
};

module.exports.updateLeaveStatus = async (req, res, next) => {
    try{
        // Approved or Rejected Status
        const { id } = req.params;
        const { status } = req.body;

        const userLeave = await LeaveRequest.findOne({ where:{ id }});

        if(!userLeave){
            return next(Boom.badData(messages.RECORD_NOT_FOUND));
        }
        
        userLeave.status = status;
        const updatedStatusData = await userLeave.save();
       
        // Update User Leave Balance
        const userId = userLeave.userId;
        const LeaveBalanceData = await UserLeaveModel.findOne({ where:{ userId }});

        if(!LeaveBalanceData){
            return next(Boom.badData(messages.RECORD_NOT_FOUND));
        }
    
        const startDate = userLeave.startDate;
        const endDate = userLeave.endDate;
        const diffDateStatus = parseInt((endDate - startDate) / (1000 * 60 * 60 * 24) + 1); 

        LeaveBalanceData.usedLeave = diffDateStatus;
        LeaveBalanceData.availableLeave = LeaveBalanceData.totalLeave - LeaveBalanceData.usedLeave;
        LeaveBalanceData.attendancePercentage = Math.ceil(LeaveBalanceData.totalWorkingDays - LeaveBalanceData.usedLeave) *100/ LeaveBalanceData.totalWorkingDays;

        const updatedLeaveBalance = await LeaveBalanceData.save()

        res.status(200).json({
            messages: "Leave status updated successfully",
            result: { updatedStatusData, updatedLeaveBalance }
        });
    }catch(error){
        console.log(error);
        return next(Boom.badImplementation());
    }
};

module.exports.viewAllUserLeaveRequest = async (req, res, next) => {
    try{
        const status = 'Pending'
        const userLeave = await LeaveRequest.findAll({
            where: { status },
        });

        res.status(200).json({
            result: userLeave || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    }   
};