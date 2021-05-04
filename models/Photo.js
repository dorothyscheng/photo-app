const mongoose=require('mongoose');

const photoSchema= new mongoose.Schema({
    url: {type: String, required: true},
    about: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
},{timestamps: true});

const Photo=mongoose.model('Photo',photoSchema);
module.exports=Photo;