const express=require('express');
const app=express();

// I thought that below would also bring in User and Photo models??
const db=require('./models/index');

app.set('view engine','ejs');
const path=require('path');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:false}));

// All the stuff I added for password
const User=require('./models/User');
const session=require('client-sessions');
app.use(session({
    cookieName: 'session',
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
// Login
app.get('/login',(req,res)=>{
    res.render('login');
});
app.post('/login',async (req,res)=>{
    const user= await User.findOne({username: req.body.username});
    if (!user) {
        res.send('username doesn\'t exist');
    } else {
        const match= await bcrypt.compare(req.body.password,user.password);
        if (match) {
            res.send('you\'re logged in!');
        } else {
            res.send('not a pw match');
        };
    };
});
// Home
app.get('/',(req,res)=>{
    res.render('home');
});
// LISTENER
const PORT=3000;
app.listen(PORT,()=>console.log(`Listening on http://localhost:${PORT}`));