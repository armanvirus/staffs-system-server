const User = require("../database/UserModel")
const encryptions = require("../utils/encryptions")
const infoModel = require("../database/staffsInfoModel")
module.exports = {
    staffs: async (req, res) => {
        const staffs = await infoModel.find({})
        res.json({status:200, msg: "this are the staffs records", data: staffs })
    },
    add: async (req, res) => {
        const { email, password, idNum, role } = req.body;
        if (!email || !password || !idNum)
            return res.json({ status: 401, msg: "required id, email and password" });
        const user = await User.findOne({ email });
        if (user)
            return res.json({ status: 401, msg: "user already exist" })
        const hashedPassword = await encryptions.hashPassword(password);
        if (!hashedPassword)
            return res.json({ status: 401, msg: "something went wrong" })
        const newUser = new User({
            idNum,
            email,
            password: hashedPassword,
            role
        });

        const registeredUser = await newUser.save();
        if (!registeredUser)
            return res.json({ status: 501, msg: "something went wrong" })
        res.json({ status: 200, msg: "user is created" });
    },
    addInfo: async (req, res) => {
        const {
            name,
            phone,
            gender,
            dob,
            address,
            rank,
            employmentDate,
            salary, type } = req.body;

        if (!name || !type || !phone || !gender || !dob || !address || !rank || !employmentDate || !salary)
            return res.json({status:401, msg: "incomplete data information" })
        const isAddedInfo = await infoModel.findOne({phone})
        if(isAddedInfo)
            return res.json({status:401, msg:"staff information is already exist, do update instead"})
        const newInfo = new infoModel({
            name,
            phone,
            gender,
            dob,
            address,
            rank,
            employmentDate,
            salary,
            type
        })
        const savedinfo = await newInfo.save()
        if (!savedinfo)
            return res.json({ status: 501, msg: "something went wrong" })
        res.json({ status: 200, msg: "staff information added succefully" });
    },
    remove: async (req, res) => {
        const {id } = req.params
        const user = await infoModel.findOne({ _id:id })
        if(!user)
            return res.json({status:401,msg:"action can't be completed, staff does not exist"})
        const deletedUser = await infoModel.findOneAndDelete({_id:id})
        console.log(deletedUser)
        res.json({ status:200, msg:'staff deleted succefully', data:deletedUser})
    },
    modify: async(req, res) => {
        const {
            name,
            phone,
            gender,
            dob,
            address,
            rank,
            employmentDate,
            salary, type, id } = req.body;

        if(!id || !name || !type || !phone || !gender || !dob || !address || !rank || !employmentDate || !salary)
            return res.json({status:401, msg: "incomplete data information" })
        const updatedUser = await infoModel.findByIdAndUpdate(
            id,
            { $set: { name,
                phone,
                gender,
                dob,
                address,
                rank,
                employmentDate,
                salary, type} },
            { new: true }
          );

          if(!updatedUser)
                return res.json({status:501, msg:"unable to update staff"})
            res.json({status:200, msg:"staff successfully updated"})
            
    },
    stat: async(req, res) => {
        const totalStaffs = await infoModel.countDocuments();
        const academic = await infoModel.countDocuments({type:"academic"})
        res.json({status:200, counts:{totalStaffs, academic}})

    }
}