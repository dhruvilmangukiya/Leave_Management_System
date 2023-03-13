const express = require('express');
const router = express.Router();
const leave  = require('../controllers/leaveRequest');
const authUser = require("../middleware/auth");

router.post("/leaveRequest",authUser, leave.leaveRequest);

router.get("/viewUserLeaveStatus",authUser, leave.viewUserLeaveStatus);

router.get("/viewLeaveBalance",authUser, leave.viewLeaveBalance);

router.get("/updateLeaveStatus/:id",authUser, leave.updateLeaveStatus);

router.get("/viewAllUserLeaveRequest",authUser, leave.viewAllUserLeaveRequest);

module.exports = router;