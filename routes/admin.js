const { Router } = require('express');
var express = require('express');
var router = express.Router();
const flash = require('express-flash');
const session = require('express-session');
const adminControllers = require('../controllers/adminControllers')
const userControllers = require('../controllers/userControllers')

router.use(flash());
router.use(session({ 
  secret: 'admindetails',
  resave: false,
  saveUninitialized: true
}));

router.get('/dashboard', adminControllers.dashboard)

router.get('/accept-application/:id', adminControllers.acceptApplication)

router.get('/reject-application/:id', adminControllers.rejectApplication)

// Routes for Change Password Page
router.get('/change-password', adminControllers.passwordChangePage)

router.post('/submit-change-password', adminControllers.passwordChange);

// Routes for Appointment Page
router.get('/appointments', adminControllers.appointmentsPage)

router.get('/accept-appointment/:id', adminControllers.acceptAppointment)

router.get('/reject-appointment/:id', adminControllers.rejectAppointment)

router.get('/delete-appointment/:id', adminControllers.deleteAppointment)

router.get('/cancel-appointment/:id', adminControllers.cancelAppointment)

// Routes for Doctors Page
router.get('/doctors-list', adminControllers.doctorsPage)

router.get('/doctor-details/:id', adminControllers.doctorDetailsPage)

router.get('/accept-doctor/:id', adminControllers.acceptDoctor)

router.get('/block-doctor/:id', adminControllers.blockDoctor)

router.get('/delete-doctor/:id', adminControllers.deleteDoctor)

// Route for logout page
router.get('/logout', userControllers.userLogOut);

module.exports = router