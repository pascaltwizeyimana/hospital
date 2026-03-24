const express = require('express');
const router = express.Router();
const {getAllPatients,createPatient, updatePatient, deletePatient} = require('../controller/patientController.js');

router.route('/').get(getAllPatients); // GET  method
router.route('/').post(createPatient); // POST method
router.route('/:id').put(updatePatient); // PUT method
router.route('/:id').delete(deletePatient); // DELETE method
module.exports = router;