const express=require('express');
const db=require('../models')
const router=express.Router();
const methodOverride=require('method-override');
router.use(methodOverride('_method'));
router.use(express.urlencoded({extended:false}));

function requireLogin(req,res,next) {
    if (!req.user) {
        console.log('there is no req.user');
        res.redirect('/login');
    } else {
        next();
    };
};

// ROUTES
// Index
router.get('/',async (req,res)=>{
    const allPhotos=await db.Photo.find();
    res.render('photos/index',{
        photos: allPhotos,
    });
});
// New
router.get('/new', requireLogin, async (req,res)=>{
    const user= await db.User.findOne({username: req.user})
    res.render('photos/new',{
        user: user,
    });
});
// Post
router.post('/:userId',async (req,res)=>{
    const user= await db.User.findById({_id: req.params.userId});
        const photoUrl=req.body.url;
        const photoAbout=req.body.about;
        const newPhoto=await db.Photo.create({
            url: photoUrl,
            about: photoAbout,
            user: user._id,
        });
        user.photos.push(newPhoto);
        await user.save();
        res.redirect(`/user/${user._id}`);
});
// Edit
router.get('/:id/edit', requireLogin,async (req,res)=>{
    const selected= await db.Photo.findById({_id:req.params.id});
    res.render('photos/edit',{
        selected: selected,
    });
});
// Update
router.put('/:id',async (req,res)=>{
    await db.Photo.findByIdAndUpdate({_id: req.params.id},{
        $set: {
            url: req.body.url,
            about: req.body.about,
        }
    });
    res.redirect(`/photos/${req.params.id}`);
});
// Destroy
router.delete('/:id',async (req,res)=>{
    await db.Photo.findByIdAndDelete({_id: req.params.id});
    const user= await db.User.findOne({'photos':req.params.id});
    await user.photos.remove(req.params.id);
    await user.save();
    res.redirect('/photos');
})
// Show
router.get('/:id',async (req,res)=>{
    const selected= await db.Photo.findById(req.params.id)
        .populate('user');
    res.render('photos/show',{
        selected: selected,
    });
});

module.exports=router;