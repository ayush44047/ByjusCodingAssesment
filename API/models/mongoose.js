const mongoose = require('mongoose');

const uri = "mongodb+srv://root:5CtoysIcT0zQYL1x@cluster0.zvpks.mongodb.net/employeeDB?retryWrites=true&w=majority";

const mongooseClient = mongoose.connect(uri).
then(()=>{console.log("Connected to Database")}).
catch(()=>{console.log("Error in DB Connection")});

module.exports = mongooseClient;