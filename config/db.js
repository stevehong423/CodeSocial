//CONNECTION TO DATABASE FILE

//require in mongoose and config (to access mongoURI)
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI'); //<--using config.get() allows us access to any value from default.json()

//connect with mongoDB.  this returns a promise (use async await)
const connectDB = async () => {
    try {
        await mongoose.connect(db, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('MongoDB Connected')
    } catch (error) {
        console.error(error.message); //<--Error has a 'message' property
        process.exit(1) //<--Exit process with failure. (We want our app to fail if there's an error)
    }
};

module.exports = connectDB;
