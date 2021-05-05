const mongoose=require('mongoose');
const Photo=require('./Photo');

const userSchema=new mongoose.Schema({
    username: {type: String, minLength: 1, required: true, unique: true},
    password: {type: String, required: true},
    photos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photo',
    }]
},{timestamps: true});

const User=mongoose.model('User',userSchema);
module.exports=User;