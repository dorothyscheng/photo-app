const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const methodOverride=require('method-override');
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
            res.render('index',{
                users: allUsers,
            });
        };
    });
});
// New
router.get('/new',(req,res)=>{
    res.render('new');
});
// Post
router.post('/', (req,res)=>{
    req.body.photos=req.body.photos.split(', ');
    User.create(req.body,(err,newUser)=>{
        if (err) {
            res.send(err);
        } else {
            res.redirect('/user');
        };
    });
});
// Destroy
router.delete('/:id',(req,res)=>{
    User.findByIdAndDelete({_id:req.params.id},(err,selectedUser)=>{
        if (err) {
            res.send(err);
        } else {
            res.redirect('/user');
        };
    });
});
// Edit
router.get('/:id/edit',(req,res)=>{
    User.findById({_id: req.params.id},(err,selected)=>{
        if (err) {
            res.send(err);
        } else {
            res.render('edit',{
                selected:selected,
            });
        };
    });
});
// Update
router.put('/:id', async (req,res)=>{
    const selected = await User.findById({_id: req.params.id});
    let newPhotoArr=[];
    const keys=Object.keys(req.body);
    for (let i=0; i<keys.length; i++) {
        if (keys[i].includes('photo')) {
            newPhotoArr.push((Object.values(req.body)[i]));
        };
    };
    if (req.body.newImages) {
        newPhotoArr=newPhotoArr.concat(req.body.newImages.split(', '));
    };
    await User.findByIdAndUpdate({_id: req.params.id},
        {$set: {
            username: req.body.username,
            password: req.body.password,
            photos: newPhotoArr,
            }
    });
    res.redirect(`/user/${req.params.id}`);
});
// Show
router.get('/:id', (req,res)=>{
    User.findById({_id: req.params.id},(err,selected)=>{
        if (err) {
            res.send(err);
        } else {
            res.render('show',{
                selected: selected,
            });
        };
    });
});

module.exports=router;