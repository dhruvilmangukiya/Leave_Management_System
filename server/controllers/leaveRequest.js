const User = require('../models').users;
const LeaveRequest = require('../models').leaveRequests;
const UserLeaveModel = require('../models').userLeaveModels;


const Boom = require("@hapi/boom");
const { messages } = require("../utils/message");

// Apply Leave for Hod, Faculty, Student
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

// User Own Leave Status
module.exports.viewUserLeaveStatus = async (req, res, next) => {
    try{
        const userId = req.user;
        const userLeave = await LeaveRequest.findAll({
            where :{ userId },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            result: userLeave || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    } 
};

// User Own Login Profile 
module.exports.getLeaveById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const userLeave = await LeaveRequest.findOne({
            where :{ id }
        });

        if(!userLeave) return next(Boom.badData(messages.RECORD_NOT_FOUND));
        
        res.status(200).json({
            result: userLeave
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// User Own Leave Balance 
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

// User Own Leave Update 
module.exports.leaveUpdate = async (req, res, next) => {
    try{
        const { id } = req.params;
        const data = req.body;
        data.userId = req.user;

        let leave = await LeaveRequest.findOne({ where :{ id } });
        
        if(!leave) {
            return next(Boom.badData(messages.RECORD_NOT_FOUND));
        }

        await LeaveRequest.update(data,{ 
            where :{ id }
        });

        res.status(200).json({
            message: `Leave updted successfully`,
        });
    }catch(error){
        return next(Boom.badImplementation());
    } 
};

// Leave Delete By Student
module.exports.leaveDelete = async (req, res, next) => {
    try{
        const { id } = req.params;
        const leave = await LeaveRequest.findOne({ where :{ id } });


        if(!leave) return next(Boom.badData(messages.RECORD_NOT_FOUND));

        await LeaveRequest.destroy({ where :{ id } });
        
        res.status(200).json({
            message: "Leave deleted successfully"
        });
    }
    catch(error){
        return next(Boom.badImplementation());
    }
}

// Approval Leave Status 
module.exports.approvalLeaveStatus = async (req, res, next) => {
    try{
        // Approved or Rejected Status
        const { id } = req.params;
        const { status } = req.body;

        // Check leave exists or not in LeaveRequest model
        const userLeave = await LeaveRequest.findOne({ where:{ id } });

        if(!userLeave){
            return next(Boom.badData(messages.RECORD_NOT_FOUND));
        }

        if(["Approved","Rejected"].includes(userLeave.status)){
            return res.status(422).json({
                messages: "Leave status can't update",
            });
        }
        
        userLeave.status = status;
        const updatedStatusData = await userLeave.save();

        let updatedLeaveBalance;

        if(status === 'Approved'){
            // Update User Leave Balance
            const userId = userLeave.userId;
            const LeaveBalanceData = await UserLeaveModel.findOne({ where:{ userId }});
            if(!LeaveBalanceData){
                return next(Boom.badData(messages.RECORD_NOT_FOUND));
            }
        
            // Difference between two dates
            const startDate = userLeave.startDate;
            const endDate = userLeave.endDate;
            const diffDateStatus = parseInt((endDate - startDate) / (1000 * 60 * 60 * 24) + 1); 

            // Update Used Leave
            LeaveBalanceData.usedLeave = LeaveBalanceData.usedLeave + diffDateStatus;

            // Update Available Leave
            LeaveBalanceData.availableLeave = LeaveBalanceData.totalLeave - LeaveBalanceData.usedLeave;

            // Update Attendance Percentage
            LeaveBalanceData.attendancePercentage = Math.ceil(LeaveBalanceData.totalWorkingDays - LeaveBalanceData.usedLeave) *100/ LeaveBalanceData.totalWorkingDays;

            updatedLeaveBalance = await LeaveBalanceData.save()
        }

        res.status(200).json({
            message: "Status updated successfully",
            result: { updatedStatusData, updatedLeaveBalance }
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
};

// Get All User Leave Request List Using Filter this is not use this project
module.exports.getLeaveReport = async (req, res, next) => {
    try{
        const { status } = req.query;

        const filter = {};
        filter.status = status;

        const userLeave = await LeaveRequest.findAll({
            where: { status: filter.status },
        });

        res.status(200).json({
            result: userLeave || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    }   
};

// Get All User Leave Request
module.exports.getUserAllLeaveReport = async (req, res, next) => {
    try{
        const userLeave = await UserLeaveModel.findAll({
            include:{
                model: User,
                as:'user',
                attributes: ['name','role'],
                where:{ role: 4 }
            },
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json({
            result: userLeave || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    } 
};

// Get All Leave Request List for Faculty
module.exports.getAllLeaveList = async (req, res, next) => {
    try{
        const userLeave = await LeaveRequest.findAll({
            include:{
                model: User,
                as:'user',
                attributes: ['name'],
            },
            where:{
                status: 'Pending'
            },
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json({
            result: userLeave || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    }  
};

