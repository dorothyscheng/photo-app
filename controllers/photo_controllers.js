const express=require('express');
const router=express.Router();
const User=require('../models/User');
// ROUTES
// Index
router.get('/',async (req,res)=>{
    const allUsers= await User.find();
    res.render('photos/index',{
        users: allUsers,
    });
});

module.exports=router;