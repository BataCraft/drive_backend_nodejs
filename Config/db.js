const { default: mongoose } = require('mongoose');
const db = require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log(`mongo db connected`);
        
    })

}

module.exports = connectDB;