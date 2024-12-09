const mongoose = require("mongoose"),
      Schema = mongoose.Schema;

   const verificationSchema = new Schema({
        user:{type:String, required:true, unique:true},
        token:{type:String, required:true,},
        expiresIn:{ type:Number, required:true,}
        
      });


   module.exports = mongoose.model("verification", verificationSchema);