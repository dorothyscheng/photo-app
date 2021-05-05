const express=require('express');
const router=express.Router();
const methodOverride=require('method-override');
const Photo = require('../models/Photo');
const User=require('../models/User');
router.use(express.urlencoded({extended: false}));
router.use(methodOverride('_method'));
// ROUTES
// Index
router.get('/', (req,res)=>{
    User.find({},(err,allUsers)=>{
        if (err) {
            res.send(err);
        } else {
            res.render('users/index',{
                users: allUsers,
            });
        };
    });
});
// New
router.get('/new',(req,res)=>{
    res.render('users/new');
});
// Post
router.post('/', (req,res)=>{
    User.create(req.body,(err,newUser)=>{
        if (err) {
            res.send(err);
        } else {
            res.redirect('/user');
        };
    });
});
// Destroy
router.delete('/:id', async (req,res)=>{
    await User.findByIdAndDelete({_id:req.params.id});
    await Photo.deleteMany({user: req.params.id});
    res.redirect('/user');
});
// Edit
router.get('/:id/edit',(req,res)=>{
    User.findById({_id: req.params.id},(err,selected)=>{
        if (err) {
            res.send(err);
        } else {
            res.render('users/edit',{
                selected:selected,
            });
        };
    });
});
// Update
router.put('/:id', async (req,res)=>{
    const selected = await User.findById({_id: req.params.id});
    await User.findByIdAndUpdate({_id: req.params.id},
        {$set: {
            username: req.body.username,
            password: req.body.password,
            }
    });
    res.redirect(`/user`);
});
// Show
router.get('/:id', async (req,res)=>{
    const user= await User.findById({_id:req.params.id})
        .populate('photos');
    res.render('users/show',{
        selected: user,
    });
});

module.exports=router;