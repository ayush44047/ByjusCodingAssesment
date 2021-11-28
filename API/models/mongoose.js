const mongoose = require('mongoose');

const uri = "mongodb+srv://root:<yourpassword>@cluster0.zvpks.mongodb.net/employeeDB?retryWrites=true&w=majority";
mongoose.connect(uri).
then(()=>{console.log("Connected to Database")}).
catch(()=>{console.log("Error in DB Connection")});

