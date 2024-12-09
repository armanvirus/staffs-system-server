const mongoose = require("mongoose")
const dbConnection = ()=>{
    // Connect to the MongoDB database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('MongoDB connected...'))
    .catch(error => console.log(error))
}


module.exports = dbConnection;