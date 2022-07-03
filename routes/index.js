var express = require('express');
var router = express.Router();
const flash = require('express-flash');
const session = require('express-session');

router.use(flash());
router.use(session({ 
  secret: 'admindetails',
  resave: false,
  saveUninitialized: true
}));

const userControllers = require('../controllers/userControllers')
const helper = require('../helpers/Helper')

/* GET home page. */
router.get('/', userControllers.indexPage);

router.post('/submit-login', userControllers.userLogin);

// Forgot Password
router.get('/forgot-password',  userControllers.forgotPassPage);

router.post('/submit-forgot-password', userControllers.submitForgotPassword)

router.get('/forgot-password-verification-email', helper.forgotPasswordVerificationEmail)

router.get('/verification-page', userControllers.forgotPasswordVerification)

router.post('/submit-verification', userControllers.submitForgotPasswordVerification)

router.get('/set-new-password', userControllers.setNewPasswordPage)

router.post('/submit-set-new-password', userControllers.submitSetNewPassword)

// Sign up
router.get('/doctor-signup', userControllers.doctorSignupPage);

router.get('/patient-signup', userControllers.patientSignupPage);

router.post('/submit-patient-registration', userControllers.submitPatientRegistration);

router.post('/submit-doctor-registration', userControllers.submitDoctorRegistration);

router.get('/otp-verification-page', userControllers.authPage)

router.post('/submit-email-authentication', userControllers.submitAuthPage)

router.get('/send-email', helper.sendEmailVerification)

module.exports = router;
