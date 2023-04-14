const router = require("express").Router();
const userRoute = require("../routes/user");
const leaveRequestRoute = require("../routes/leaveRequest");

// User Route
router.use("/api/users", userRoute);

// User Leave Route
router.use("/api/leave", leaveRequestRoute);

module.exports = router;