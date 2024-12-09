const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;
module.exports = {
    hashPassword: async (password) => {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    },
    comparePassword: async (hashedPassword, plainPassword) => {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    },
    signToken: async (user) => {
        const token = await jwt.sign({ user: user.email }, process.env.JWT_TOKEN, { expiresIn: "30d" })
        return token;
    },
    verifyToken: async (req) => {
        let token = req.headers.authorization;
        if (token && token.startsWith('Bearer ')){
          token = token.split(" ")[1]
          try {
              const decoded = await jwt.verify(token, process.env.JWT_TOKEN)
              return decoded;
          }
          catch (err) {
              console.log(err)
              return;
          }
        }

        return ;
    },
    issueVerification:async(user,Model)=>{
        const token = uuid();
        const expiresIn = Math.ceil(Date.now() + (10*60*1000));
        const existToken = await Model.findOne({user:user._id});
        if(existToken)
           await Model.deleteMany({user:user._id});
        const verification = new Model({
            user:user._id,
            token,
            expiresIn
        })

        try{
            const data = await verification.save();
            if(!data)
                return ;
            return data;
        } 
        catch(err){
            console.log(err)
            return ;
        }
    }

}