const userModel = require("../database/UserModel")

const isAllowed = async (req, res, next) =>{
const {user} = req.user;
const isUser = await userModel.findOne({email:user});
if(!isUser)
    return res.json({ status:401, msg: "Unauthorized: invalid user" });
if(isUser.role === "admin"){
    req.profile = isUser
    next();
}else{
    return res.json({ status:401, msg: "Unauthorized: action is not allowed" });
}
}

module.exports = isAllowed;