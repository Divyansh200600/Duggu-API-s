const express = require('express');
const { sendWishEmail } = require('../../../controllers/KCMT-SIS/WishEmail/wishEmailController');

const router = express.Router();

router.post('/send-wish-email', sendWishEmail);

module.exports = router;