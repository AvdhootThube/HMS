var express = require('express');
var router = express.Router();
const flash = require('express-flash');
const session = require('express-session');
const patientControllers = require('../controllers/patientControllers')
const userControllers = require('../controllers/userControllers')

router.use(flash());
router.use(session({ 
  secret: 'admindetails',
  resave: false,
  saveUninitialized: true
}));

// Edit Profile
router.get('/edit-profile', patientControllers.editProfilePage);

router.post('/submit-profile-changes', patientControllers.submitProfileChanges);

// Change Password Page
router.get('/change-password', patientControllers.passwordChangePage);

router.post('/submit-change-password', patientControllers.passwordChange);

// Book Appointment
router.get('/book-appointment',  patientControllers.bookAppointmentPage);

router.post('/submit-appointment',  patientControllers.submitAppointment);

// See Appointment
router.get('/upcoming-appointment',  patientControllers.upcomingAppointment);

router.get('/delete-appointment/:id',  patientControllers.deleteAppt);

router.get('/cancel-appointment/:id',  patientControllers.cancelAppointment);

// Logout User
router.get('/logout', userControllers.userLogOut);

module.exports = router;
