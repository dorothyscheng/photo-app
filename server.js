const express=require('express');
const app=express();
const db=require('./models');
app.set('view engine','ejs');
const path=require('path');
app.use(express.static(path.join(__dirname,'public')));
// ROUTERS
const userControllers=require('./controllers/user_controllers.js');
app.use('/user',userControllers);
// LISTENER
const PORT=3000;
app.listen(PORT,()=>console.log(`Listening on http://localhost:${PORT}`));