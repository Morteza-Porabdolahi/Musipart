const mongoose = require('mongoose');

module.exports = async () => {
    try{
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log('Connected to Database!');
    }catch(e){
        console.log(e);
    }
}