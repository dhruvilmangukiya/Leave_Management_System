require("dotenv").config();
const express = require('express');    
const app = express();
const bodyParser = require('body-parser');
const path = require("path");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./utils/errorHandler");
const port = process.env.PORT || 3000; 

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/public", express.static(path.join(__dirname, 'public')));

// Routers
const indexRoute = require("./routes/index");
app.use("/", indexRoute);
app.use(errorHandler);


app.listen(port, () => {
    console.log(`App is run on port no ${port}`);
});