const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    joiningDate: { type: Date, default: Date.now ,required: true}
});

module.exports = mongoose.model('Employee',employeeSchema); 