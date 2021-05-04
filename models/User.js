const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    username: {type: String, minLength: 1, required: true},
    password: {type: String, minLength: 8, maxLength: 20, required: true},
    photos: [
        {
        url: String,
        about: String,
        }
    ],
},{timestamps: true});

const User=mongoose.model('User',userSchema);
module.exports=User;