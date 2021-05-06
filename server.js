const express=require('express');
const app=express();

const db=require('./models');
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
    secret: 'aarghelsehaielsienlwekj',
    duration: 30*60*1000,
    activeDuration: 5*60*1000,
}))
const bcrypt=require('bcrypt');
const saltRounds=10;

// ROUTERS
// User
const userControllers=require('./controllers/user_controllers.js');
app.use('/user',userControllers);
// Photos
const photoControllers=require('./controllers/photo_controllers.js');
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
// Home
app.get('/',(req,res)=>{
    res.render('home');
});
// LISTENER
const PORT=3000;
app.listen(PORT,()=>console.log(`Listening on http://localhost:${PORT}`));