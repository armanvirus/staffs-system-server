const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const authRoutes = require('./routes/auths');
const managementRoutes = require('./routes/management');
const cors = require('cors')

const PORT = process.env.PORT || 5001;
//config environment variable
dotenv.config()
//allow cross site scripting
app.use(cors({origin:'*'}))
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    next()
})
//connect db
require('./database/dbConnection.js')()
// parse incoming request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// refer to these routes for any authentication related stuffs.
app.use('/user/auth', authRoutes)

// routes related to staff management goes here

app.use('/management', managementRoutes)









app.listen(PORT, ()=> console.log(`server is running on PORT ${PORT}`))