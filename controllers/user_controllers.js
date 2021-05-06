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
router.post('/', async (req,res)=>{
    const hashedPw=await bcrypt.hash(req.body.password,saltRounds);
    await db.User.create({
        username:req.body.username,
        password: hashedPw,
    });
    res.redirect('/user');
});
// Destroy
router.delete('/:id', requireLogin, async (req,res)=>{
    const user= await db.User.findById({_id: req.params.id});
    if (req.user===user.username) {
        await user.delete();
        await db.Photo.deleteMany({user: req.params.id});
        req.userLogin.reset();
        res.redirect('/user');
    } else {
        res.send('you are not this user');
    };
});
// Edit
router.get('/:id/edit',(req,res)=>{
    db.User.findById({_id: req.params.id},(err,selected)=>{
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
    const hashedPw=await bcrypt.hash(req.body.password,saltRounds);
    await db.User.findByIdAndUpdate({_id: req.params.id},
        {$set: {
            username: req.body.username,
            password: hashedPw,
            }
    });
    res.redirect(`/user`);
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