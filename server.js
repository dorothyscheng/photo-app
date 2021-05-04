const express=require('express');
const app=express();
const db=require('./models');
app.set('view engine','ejs');
const path=require('path');
app.use(express.static(path.join(__dirname,'public')));
// ROUTERS
// User
const userControllers=require('./controllers/user_controllers.js');
app.use('/user',userControllers);
// Photos
const photoControllers=require('./controllers/photo_controllers.js');
app.use('/photos',photoControllers)
// LISTENER
const PORT=3000;
app.listen(PORT,()=>console.log(`Listening on http://localhost:${PORT}`));