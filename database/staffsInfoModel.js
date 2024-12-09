const mongoose = require("mongoose"),
      Schema = mongoose.Schema;

   const InfoSchema = new Schema({
        img:{type:String},
        name:{type:String, required:true},
        phone:{type:String, required:true},
        gender:{type:String, required:true},
        dob:{type:String, required:true},
        address:{type:String, required:true},
        rank:{type:String, required:true},
        employmentDate:{type:String, required:true},
        salary:{type:String, required:true},
        type:{type:String, required:true},
        createdOn:{ type: Date, 'default': Date.now }   
      });


   module.exports = mongoose.model("staffinfo", InfoSchema);