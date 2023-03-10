require("dotenv").config();
const express = require('express');    
const app = express();
// const DB = require("./database/config");
// DB.Connect();
const bodyParser = require('body-parser');
const { errorHandler } = require("./utils/errorHandler");
const port = process.env.PORT || 3000; 

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routers
const indexRoute = require("./routes/index");
app.use("/", indexRoute);
app.use(errorHandler);


app.listen(port, () => {
    console.log(`App is run on port no ${port}`);
})