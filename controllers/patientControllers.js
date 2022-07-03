const session = require('express-session');
const { Appointment } = require('../models/appointment')
const apptServices = require('../services/apptServices')
const userServices = require('../services/userServices')

// Edit Profile
const editProfilePage = async (req, res, next) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    let err_msg = req.flash('err_msg')
    let success_msg = req.flash('success_msg')
    var user = await userServices.checkUser(req.session.email)
    return res.render('patient/edit-profile',{ session: req.session, err_msg, success_msg, user });
}

const submitProfileChanges = async (req, res) => {
    try {
        if (req.body.mobile_no !== '' && req.body.mobile_no !== null){
            let checkMobNo = await userServices.validateMobileNo(req.body.mobileNo)
            if (!checkMobNo) {
                req.flash('err_msg', 'Invalid Mobile Number')
                return res.redirect('/patient/edit-profile');
            }
        }
        if (req.body.dob != '' && req.body.dob != null){
            let checkDOB = await userServices.validateDOB(req.body.dob)
            if (!checkDOB) {
                req.flash('err_msg', 'Invalid Date of Birth format')
                return res.redirect('/patient/edit-profile');
            }
        }
        await userServices.updateProfile(req.session.email, req.body)
        req.flash('success_msg', 'Profile updated successfully')
        res.redirect('/patient/edit-profile')
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please Try again later')
        res.redirect('/patient/edit-profile')
    }
}

// Change Password
const passwordChangePage = async(req, res) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    res.render('patient/change-password', { session: req.session, err_msg, success_msg })
}

const passwordChange = async (req, res) => {
    var currentPass = await userServices.createCipher(req.body.currentPass)
    var newPass = await userServices.createCipher(req.body.newPassword)
    var confNewPass = await userServices.createCipher(req.body.confNewPass)
    var user = await userServices.checkUser(req.session.email)
    if (currentPass != user.password) {
        req.flash('err_msg', 'Please enter correct password')
        return res.redirect('/patient/change-password')
    }
    if (currentPass == newPass) {
        req.flash('err_msg', 'Current password and new password cannot be same')
        return res.redirect('/patient/change-password')
    }
    if (confNewPass != newPass) {
        req.flash('err_msg', 'New Password and Confirm Password does not match')
        return res.redirect('/patient/change-password')
    }
    try {
        await userServices.changePassword(req.session.email, newPass)
        req.flash('success_msg', 'Password changed successfully')
        res.redirect('/patient/change-password')
    } catch (error) {
        req.flash('err_msg', 'something went wrong. Please try again later')
        res.redirect('/patient/change-password')
    }
}

// Book Appointment
const bookAppointmentPage = async (req, res) => {
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    let test = req.session.is_user_logged_in;
    if (!test) {
        req.flash('err_msg','Please login to your account to continue.')
        return res.redirect('/')
    }
    return res.render('patient/book-appointment', { err_msg, success_msg, session: req.session });
}

const submitAppointment = async (req, res) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        req.flash('err_msg','Please login to your account to continue.')
        return res.redirect('/')
    }
    let doctorEmail = await apptServices.getRandomDoctor(req.body.dept)
    let doctorDetails = await userServices.checkUser(doctorEmail.email)
    var bookAppointment = await apptServices.bookAppointment(req.body, doctorDetails)
    if (bookAppointment) {
        res.redirect('/patient/upcoming-appointment')
    }
}

// Upcoming Appointments
const upcomingAppointment = async (req, res, next) => {
    let test = req.session.is_user_logged_in;
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    if (!test) {
        req.flash('err_msg','Please login to your account to continue.')
        return res.redirect('/')
    }
    var appointments = await apptServices.fetchAppointments(req.session.email)
    return res.render('patient/upcoming-appointment',{ session: req.session, err_msg, success_msg, appointments });
}

const deleteAppt = async (req, res) => {
    try {
        await apptServices.appointmentDelete(req.params.id)
        req.flash('success_msg', 'Appointment has been deleted')
        res.redirect('/patient/upcoming-appointment')
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please try again later')
        res.redirect('/patient/upcoming-appointment')
    }
}

const cancelAppointment = async (req, res) => {
    try {
        await apptServices.appointmentCancel(req.params.id)
        req.flash('success_msg','Appointment is cancelled')
        res.redirect('/patient/upcoming-appointment')
    } catch (error) {
        req.flash('err_msg','Something went Wrong. Please try again later.')
        res.redirect('/patient/upcoming-appointment')
    }
}

module.exports = {
    upcomingAppointment,
    deleteAppt,
    cancelAppointment,
    bookAppointmentPage,
    submitAppointment,
    editProfilePage,
    submitProfileChanges,
    passwordChangePage,
    passwordChange
}