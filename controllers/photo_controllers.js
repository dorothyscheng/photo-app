const express=require('express');
const Photo = require('../models/Photo');
const router=express.Router();
const User=require('../models/User');
router.use(express.urlencoded({extended:false}));
// ROUTES
// Index
router.get('/',async (req,res)=>{
    const allPhotos=await Photo.find();
    res.render('photos/index',{
        photos: allPhotos,
    });
});
// New
router.get('/new', (req,res)=>{
    res.render('photos/new');
})
// Post
router.post('/',async (req,res)=>{
    const username=req.body.username;
    const user= await User.findOne({username:username});
    if (! user) {
        res.send('error: user doesn\'t exist');
    } else {
        const userId=user._id;
        const photoUrl=req.body.url;
        const photoAbout=req.body.about;
        const newPhoto=await Photo.create({
            url: photoUrl,
            about: photoAbout,
            user: userId,
        });
        user.photos.push(newPhoto);
        await user.save();
        res.redirect(`/user/${userId}`);
    };
});

module.exports=router;