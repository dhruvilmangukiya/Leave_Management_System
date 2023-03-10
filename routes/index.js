const router = require("express").Router();
const userRoute = require("../routes/user");

// User Route
router.use("/api/users", userRoute);

module.exports = router;