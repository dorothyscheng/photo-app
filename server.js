const express=require('express');
const app=express();
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const db=require('./models');
const userControllers=require('./controllers/user_controllers.js');
const photoControllers=require('./controllers/photo_controllers.js');

app.set('view engine','ejs');
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({extended:false}));

// References for password & session:
// https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions
// https://www.npmjs.com/package/bcrypt
// Read this to learn how to persist sessions during dev: https://www.npmjs.com/package/connect-mongo
const session=require('client-sessions');
app.use(session({
    cookieName: 'userLogin',
    secret: process.env.SESSION_SECRET,
    duration: 30*60*1000,
    activeDuration: 5*60*1000,
}))
const bcrypt=require('bcrypt');
app.use((req,res,next)=>{
    if (req.userLogin && req.userLogin.user) {
        db.User.findOne({username: req.userLogin.user},(err,foundUser)=>{
            if (foundUser) {
                req.user=foundUser.username;
                req.userLogin.user=foundUser.username;
            };
            next();
        });
    } else {
        next();
    };
});

// ROUTERS
app.use('/user',userControllers);
app.use('/photos',photoControllers)

// ROOT ROUTES
// Login
app.get('/login',(req,res)=>{
    res.render('login');
});
app.post('/login',async (req,res)=>{
    const user= await db.User.findOne({username: req.body.username});
    if (!user) {
        res.send('username doesn\'t exist');
    } else {
        const match= await bcrypt.compare(req.body.password,user.password);
        if (match) {
            req.userLogin.user=user.username;
            res.redirect(`/user/${user._id}`);
        } else {
            req.userLogin.reset();
            res.redirect('/login');
        };
    };
});
// Logout
app.get('/logout',(req,res)=>{
    req.userLogin.reset();
    res.redirect('/');
});
// Profile
app.get('/profile',async (req,res)=>{
    if (req.userLogin && req.userLogin.user) {
        user= await db.User.findOne({username: req.userLogin.user});
        res.redirect(`/user/${user._id}`);
    } else {
        res.redirect('/login');
    };
});
// Home
app.get('/',(req,res)=>{
    res.render('home');
});

// ERROR HANDLING
app.use((err,req,res,next)=>{
    let message;
    if (err==='permission') {
        res.status(401);
        message= 'You don\'t have permission for this action.';
    } else if (err==='validation') {
        res.status(400);
        message='Something went wrong. Make sure you filled in all required fields.';
    };
    res.render('error',{
        message: message,
    });
});

// LISTENER
app.listen(PORT,()=>console.log(`Listening on http://localhost:${PORT}`));