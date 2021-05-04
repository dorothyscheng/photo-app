const mongoose=require('mongoose');
const dbUrl='mongodb://localhost:27017/photoApp';
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false,
});
mongoose.connection.on('connected',()=>console.log(`Mongoose connected on ${dbUrl}`));
mongoose.connection.on('error',()=>console.log(`Mongoose error: ${error}`));
mongoose.connection.on('disconnected',()=>console.log('Mongoose disconnected'));

module.exports={
    User: require('./User'),
    Photo: require('./Photo'),
}