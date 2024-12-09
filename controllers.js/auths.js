const User = require('../database/UserModel')
const encryptions = require("../utils/encryptions")
const verificationModel = require("../database/verificationToken")
const forgotTokenModel = require("../database/forgotToken")
const PORT = process.env.PORT || 5000;
const http = require("http")
const sendMails = require("../utils/mail")

module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password)
            return res.json({ status: 401, msg: "required email and password" });
        const user = await User.findOne({ email });
        if (!user)
            return res.json({ status: 404, msg: "user not found" })
        const isPassordMatched = await encryptions.comparePassword(user.password, password);
        if (!isPassordMatched)
            return res.json({ status: 401, msg: "wrong email or password" })
        // if(!user.verified){
        //     const verificationParam = await encryptions.issueVerification(user,verificationModel)
        //     if(!verificationParam)
        //     return res.json({status:401, msg:"something went wrong"})
        // const link = `${req.protocol}://${req.hostname}:${PORT}/confirm/email/user/auth/${verificationParam.token}/${verificationParam.user}`
        // const sub = "Email verification";
        // const isSent = await sendMails(user.email, sub, link);
        // if(!isSent){
        //    await verificationModel.deleteMany({user:verificationParam.user})
        //    return res.json({status:500, msg:"unable send varification mail at this moment"})
        // }
        //     return res.json({status:200, msg:"verification mail is sent to you",
        //      link})
        // }else{
            const jwtToken = await encryptions.signToken(user)
            res.json({ status: 200, token: jwtToken, msg: "successfully loged" })
        // }

    },
    register: async (req, res) => {
        const { email, password, name, phone } = req.body;
        console.log(password)
        if (!email || !password || !name)
            return res.json({ status: 401, msg: "required id, email and password" });
        const user = await User.findOne({ email });
        if (user)
            return res.json({ status: 401, msg: "user already exist" })
        const hashedPassword = await encryptions.hashPassword(password);
        if (!hashedPassword)
            return res.json({ status: 401, msg: "something went wrong" })
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        const registeredUser = await newUser.save();
        if  (!registeredUser)
            return res.json({ status: 501, msg: "something went wrong" })
        // const verificationParam = await encryptions.issueVerification(registeredUser,verificationModel)
        // if(!verificationParam)
        //     return res.json({status:401, msg:"something went wrong"})
        // const link = `${req.protocol}://${req.hostname}:${PORT}/confirm/email/user/auth/${verificationParam.token}/${verificationParam.user}`
        // const sub = "Email verification";
        // const isSent = await sendMails(registeredUser.email, sub, link);
        // if(!isSent){
        //    await verificationModel.deleteMany({user:verificationParam.user})
        //    return res.json({status:500, msg:"unable send varification mail at this moment"})
        // }
        res.json({ 
            status: 201, msg:"user is created", 
            // data: registeredUser,
            // link
        });
    },
    verifyUser: async(req, res) => {
        const {token, user} = req.params;
        const timeNow = Math.ceil(Date.now())
        const storedToken = await verificationModel.findOne({user})
        if(!storedToken)
            return res.json({status:401, msg:"please relogin "})
        if(storedToken.token !== token || timeNow > storedToken.expiresIn){
            const isDeleted = await verificationModel.deleteOne({user})
            if(!isDeleted)
            return res.json({status:401, msg:"internal server error"});
                   res.json({status:401, msg:"invalide link, instead relogin "})
        }else{
           const isupdated = await User.findByIdAndUpdate(storedToken.user, {$set:{"verified":true}})
           console.log(isupdated)
           res.json({status:201, msg:"email is verified, can now login"})
        }


    },
    forgotPassword:async(req, res) => {
        console.log(http)
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user) 
            return res.json({status:404, msg:"user not found"})
        const isInitiated = await encryptions.issueVerification(user,forgotTokenModel)
        if(!isInitiated)
            return res.json({status:500, msg:"internal server error"});
            const link = `${process.env.CLIENT_F_P}/${isInitiated.token}`
            const sub = "Forgot password mail";
            const isSent = await sendMails(user.email, sub, link);
            if(!isSent){
               await forgotTokenModel.deleteMany({user:isInitiated.user})
               return res.json({status:500, msg:"unable send varification mail at this moment"})
            }
        res.json({status:201, msg:"forgot password link sent to your mail"})

    },
    changePassword:async(req, res) => {
        const {token,issuer} = req.params;
        const {password} = req.body
        const user = await User.findOne({_id:issuer});
        if(!user)
            return res.json({status:401, msg:"user not found"})
        const forgotToken = await forgotTokenModel.findOne({token});
        if(!forgotToken)
            return res.json({status:401, msg:"invalid link"})
        if(user._id != forgotToken.user)
            return res.json({status:401, msg:"invalid user link"});
        const isTimeOut = Date.now() > forgotToken.expiresIn;
        if(isTimeOut)
            return res.json({status:401, msg:"link used is expired"});
            const hashedPassword = await encryptions.hashPassword(password);
        if(!hashedPassword)
            return res.json({status:401, msg:"internal server error"})
        const isupdated = await User.findByIdAndUpdate(user._id, {$set:{"password":hashedPassword}})
        if(!isupdated)
            return res.json({status:401, msg:"something went wrong"})
            await forgotTokenModel.deleteMany({user:user._id})
            res.json({status:201, msg:"password is successfully changed"})
        
    },
    resetPassword:async(req, res) => {
        const {oldPassword, newPassword} = req.body;
        if(!oldPassword || !newPassword)
            return res.json({status:401, msg:"all field are required"})
        const token = await encryptions.verifyToken(req);
        if(!token)
            return res.json({status:401, msg:"invalid credentials"})
        const user = await User.findOne({email:token.user});
        if(!user)
            return res.json({status:401, msg:"authorization failed"})
        const isPasswordMatched = await encryptions.comparePassword(user.password, oldPassword);
        if(!isPasswordMatched)
            return res.json({status:304, msg:"wrong old password"})
        const hashPassword = await encryptions.hashPassword(newPassword);
        if(!hashPassword)
            return res.json({status:304, msg:"internal server error"})
        const isReset = await User.findByIdAndUpdate(user._id, {$set:{"password":hashPassword}})
            if(!isReset)
            return res.json({status:304, msg:"something went wrong"})
        res.json({status:200, msg:"password successfully reset"})
    },

}