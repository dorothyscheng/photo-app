const express=require('express');
const Photo = require('../models/Photo');
const router=express.Router();
const User=require('../models/User');
const methodOverride=require('method-override');
router.use(methodOverride('_method'));
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
// Destroy
router.delete('/:id',async (req,res)=>{
    const deletedPhoto= await Photo.findByIdAndDelete({_id: req.params.id});
    const user= await User.findOne({'photos':req.params.id});
    // res.send(user);
    await user.photos.remove(req.params.id);
    await user.save();
    res.redirect('/photos');
})
// Show
router.get('/:id',async (req,res)=>{
    const selected= await Photo.findById(req.params.id)
        .populate('user');
    res.render('photos/show',{
        selected: selected,
    });
});

module.exports=router;