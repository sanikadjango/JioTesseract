const express = require('express');
const router = express.Router();

const bookingControlller = require('../controllers/bookingController')

//input: emp_id, password
router.post('/login', bookingControlller.login);

//input: all user details
router.post('/register', bookingControlller.register);

//input: all user details
router.post('/edit-user-details', bookingControlller.editUserDetails);

//input: user_id
router.post('/book-slot', bookingControlller.bookSlot);

//input: user_id, parking_number
router.post('/check-in', bookingControlller.checkIn);

//input: user_id
router.post('/check-out', bookingControlller.checkOut);




//For QA

router.get('/available-slots', bookingControlller.getAllAvailableSlots);

router.get('/booked-slots', bookingControlller.getAllBookedSlots);

router.get('/registered-users', bookingControlller.getAllRegisteresUsers);



module.exports = router;
