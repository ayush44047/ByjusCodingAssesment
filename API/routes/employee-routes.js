const express = require('express');
const { check } = require('express-validator');

const employeeController = require('../controllers/employeeController');

var router = express.Router();


router.post('/',
    [
        check('fullName').isLength({ min: 2 }),
        check('email').not().isEmpty(),
        check('phone').not().isEmpty(),
        check('address').not().isEmpty(),
        check('joiningDate').not().isEmpty()
    ],
    employeeController.insertEmployee);

router.patch('/:uId',
    [
        check('fullName').isLength({ min: 2 }),
        check('email').not().isEmpty(),
        check('phone').not().isEmpty(),
        check('email').isEmail(),
        check('address').not().isEmpty(),
        check('joiningDate').not().isEmpty()
    ],
    employeeController.updateEmployee);

router.delete('/:uId', employeeController.deleteEmployee);

router.get('/:uId', employeeController.getEmployeeById);

router.get('/', employeeController.getAllEmployees);

module.exports = router;