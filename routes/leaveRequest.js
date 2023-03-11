const express = require('express');
const router = express.Router();
const leaveRequest  = require('../controllers/leaveRequest');
const authUser = require("../middleware/auth");

router.post("/leaveRequest",authUser, leaveRequest.leaveRequest);

module.exports = router;