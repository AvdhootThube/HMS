var express = require('express');
var router = express.Router();
const flash = require('express-flash');
const session = require('express-session');
const doctorControllers = require('../controllers/doctorControllers')
const userControllers = require('../controllers/userControllers')

router.use(flash());
router.use(session({ 
  secret: 'admindetails',
  resave: false,
  saveUninitialized: true
}));


// Route for dashboard
router.get('/dashboard', doctorControllers.dashboard);

router.get('/cancel-appointment/:id',  doctorControllers.cancelAppointment);

// Edit Profile
router.get('/edit-profile', doctorControllers.editProfilePage);

router.post('/submit-profile-changes', doctorControllers.submitProfileChanges);

// Change Password Page
router.get('/change-password', doctorControllers.passwordChangePage);

router.post('/submit-change-password', doctorControllers.passwordChange);

// Route for Logout 
router.get('/logout', userControllers.userLogOut);

module.exports = router;
