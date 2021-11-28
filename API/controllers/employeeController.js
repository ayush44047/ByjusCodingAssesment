const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const Employee = require('../models/employee.model');
const HttpError = require('../models/http-error.model');

const getEmployeeById = async (req, res, next) => {
    const userId = req.params.uId;
    let employee;
    try {
        employee = await Employee.findById(userId);
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong , could not find the employee.', 500));
    }

    if (!employee) {
        return next(new HttpError('Employee not available', 404));
    }
    res.json(employee.toObject({ getters: true }));
}

const getAllEmployees = async (req, res, next) => {

    let employees;
    try {
        employees = await Employee.find();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong , could not fetch the employees.', 500));
    }

    if (!employees || employees.length < 1) {
        return res.json([]);
    }
    res.json(employees.map(employee=>employee.toObject({getters:true})));
}

const insertEmployee = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed,Please check your input data.', 422);
    }

    const { id, fullName, email, address, joiningDate } = req.body;
    const employeeToBeInserted = new Employee({
        id: uuidv4(),
        fullName,
        email,
        address,
        joiningDate
    });

    try {
        await employeeToBeInserted.save();
    }
    catch (err) {
        console.log({ err });
        return next(new HttpError('User insertion failed', 500));
    }

    res.status(201).json(employeeToBeInserted.toObject({getters:true}));
}

const updateEmployee = async(req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed,Please check your input data.', 422);
    }

    const { fullName, email, address, joiningDate } = req.body;
    const userId = req.params.uId;

    let employeeToBeUpdated;
    try {
        employeeToBeUpdated = await Employee.findById(userId);
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong , could not find the employee.', 500));
    }

    if (!employeeToBeUpdated) {
        return next(new HttpError('Employee not available', 404));
    }

    employeeToBeUpdated.fullName = fullName;
    employeeToBeUpdated.email = email;
    employeeToBeUpdated.address = address;
    employeeToBeUpdated.joiningDate = joiningDate;

    try {
        await employeeToBeUpdated.save();        
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong , could not update the employee details.', 500));
    }

    res.status(200).json(employeeToBeUpdated.toObject({getters:true}));
}

const deleteEmployee = async(req, res, next) => {
    const userId = req.params.uId;

    let employeeToBeDeleted;
    try {
        employeeToBeDeleted = await Employee.findById(userId);
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong , could not find the employee.', 500));
    }

    if (!employeeToBeDeleted) {
        return next(new HttpError('Employee not available', 404));
    }   

    try {
        await employeeToBeDeleted.remove();        
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong , could not delete the employee details.', 500));
    }

    res.status(200).json({message : 'Succesfully deleted employee.' });
}

exports.getAllEmployees = getAllEmployees;
exports.getEmployeeById = getEmployeeById;
exports.updateEmployee = updateEmployee;
exports.deleteEmployee = deleteEmployee;
exports.insertEmployee = insertEmployee;

