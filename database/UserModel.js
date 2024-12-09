const mongoose = require("mongoose"),
      Schema = mongoose.Schema;

   const UserSchema = new Schema({
        name:{type:String, required:true, unique:true},
        email:{type:String, required:true, unique:true},
        password:{type:String, required:true},
        role:{type:String, "default":"staff"},
        verified:{type:Boolean, default:true},
        createdOn:{ type: Date, 'default': Date.now }   
      });


   module.exports = mongoose.model("useracc", UserSchema);
