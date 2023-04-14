const express = require('express');
const router = express.Router();
const leave  = require('../controllers/leaveRequest');
const authUser = require("../middleware/auth");

// Student
router.post("/leaveRequest",authUser, leave.leaveRequest);

router.get("/viewUserLeaveStatus",authUser, leave.viewUserLeaveStatus);

router.get("/getLeaveById/:id",authUser, leave.getLeaveById);

router.get("/viewLeaveBalance",authUser, leave.viewLeaveBalance);

router.put("/leaveUpdate/:id",authUser, leave.leaveUpdate);

router.delete("/leaveDelete/:id",authUser,leave.leaveDelete);

router.get("/getUserAllLeaveReport",authUser, leave.getUserAllLeaveReport);



// HOD & Faculty
router.put("/approvalLeaveStatus/:id",authUser, leave.approvalLeaveStatus);

router.get("/getLeaveReport",authUser, leave.getLeaveReport);

router.get("/getAllLeaveList",authUser, leave.getAllLeaveList);

module.exports = router;