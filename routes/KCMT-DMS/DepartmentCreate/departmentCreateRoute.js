const express = require('express');
const { DepartmentCreateSendMail } = require('../../../controllers/KCMT-DMS/DepartmentCreate/departmentCreateController');

const router = express.Router();

router.post('/department-create-send-email', DepartmentCreateSendMail);

module.exports = router;
