const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [3, 'user name must be 3 characters']
    },

    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
       
    },


    password:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [3, 'user name must be 3 characters']
    }
})

const user = mongoose.model('user', userSchema);
 
module.exports = user;