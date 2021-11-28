const express = require('express');
const bodyParser = require('body-parser');

const employeeRoutes = require('./routes/employee-routes');
const HttpError = require('./models/http-error.model');
const mongooseClient = require('./models/mongoose');

var app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    next();
})
app.use('/api/employee', employeeRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find the route', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occured' });
});

mongooseClient
    .then(() => {
        app.listen(3000, () => {
            console.log("Express server started at port : 3000");
        });
    })
    .catch(err => {
        console.log(err);
    });


