const express=require('express');
const router=express.Router();
const methodOverride=require('method-override');
// Instead of requiring every model here, just required db, then use db. to access the models
const db=require('../models');
router.use(express.urlencoded({extended: false}));
router.use(methodOverride('_method'));

function requireLogin(req,res,next) {
    if (!req.user) {
        res.redirect('/login');
    } else {
        next();
    };
};

// LOGIN
const bcrypt=require('bcrypt');
const saltRounds=10;
// ROUTES
// Index
router.get('/', (req,res)=>{
    db.User.find({},(err,allUsers)=>{
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
router.post('/', async (req,res,next)=>{
    try {
        const hashedPw=await bcrypt.hash(req.body.password,saltRounds);
        await db.User.create({
            username:req.body.username,
            password: hashedPw,
        });
        res.redirect('/user');
    } catch(error) {
        const err='validation';
        next(err);
    };
});
// Destroy
router.delete('/:id', requireLogin, async (req,res,next)=>{
    const user= await db.User.findById({_id: req.params.id});
    if (req.user===user.username) {
        await user.delete();
        await db.Photo.deleteMany({user: req.params.id});
        req.userLogin.reset();
        res.redirect('/user');
    } else {
        const err='permission';
        next(err);
    };
});
// Edit
router.get('/:id/edit', requireLogin, async (req,res,next)=>{
    const user= await db.User.findById({_id: req.params.id});
    if (req.user===user.username) {
        res.render('users/edit',{
            selected: user,
        });
    } else {
        const err='permission';
        next(err);
    };
});
// Update
router.put('/:id', async (req,res)=>{
    const user = await db.User.findById({_id: req.params.id});
    const match = await bcrypt.compare(req.body.currentPw,user.password);
    if (match) {
        newHashedPw= await bcrypt.hash(req.body.newPw,saltRounds);
        user.username=req.body.username;
        user.password=newHashedPw;
        user.save();
        res.redirect(`/user/${user._id}`);
    } else {
        const err='permission';
        next(err);
    }
});
// Show
router.get('/:id', async (req,res)=>{
    const user= await db.User.findById({_id:req.params.id})
        .populate('photos');
    res.render('users/show',{
        selected: user,
    });
});

module.exports=router;