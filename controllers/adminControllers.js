const session = require('express-session');
const { User } = require('../models/User');
const adminServices = require('../services/adminServices')
const apptServices = require('../services/apptServices')
const userServices = require('../services/userServices')

const dashboard = async (req, res) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    var pendingApplications = await adminServices.getPendingApplications()
    res.render('admin/dashboard', { session: req.session, pendingApplications, err_msg, success_msg})
}

const acceptApplication = async (req, res) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    try {
        await adminServices.doctorApplicationAccept(req.params.id)
        req.flash('success_msg', 'Doctor is verified and added to the Doctors List')
        res.redirect('/admin/dashboard')
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please Try again Later')
        res.redirect('/admin/dashboard')
    }
}

const rejectApplication = async (req, res) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    try {
        await User.findByIdAndDelete(req.params.id)
        req.flash('success_msg', 'Doctor is Deleted')
        res.redirect('/admin/dashboard')
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please Try again Later')
        res.redirect('/admin/dashboard')
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
    res.render('admin/change-password', { session: req.session, err_msg, success_msg })
}

const passwordChange = async (req, res) => {
    var currentPass = await userServices.createCipher(req.body.currentPass)
    var newPass = await userServices.createCipher(req.body.newPassword)
    var confNewPass = await userServices.createCipher(req.body.confNewPass)
    var user = await userServices.checkUser(req.session.re_usr_email)
    if (currentPass != user.password) {
        req.flash('err_msg', 'Please enter correct password')
        return res.redirect('/admin/change-password')
    }
    if (currentPass == newPass) {
        req.flash('err_msg', 'Current password and new password cannot be same')
        return res.redirect('/admin/change-password')
    }
    if (confNewPass != newPass) {
        req.flash('err_msg', 'New Password and Confirm Password does not match')
        return res.redirect('/admin/change-password')
    }
    try {
        await userServices.changePassword(req.session.re_usr_email, newPass)
        req.flash('success_msg', 'Password changed successfully')
        res.redirect('/admin/change-password')
    } catch (error) {
        req.flash('err_msg', 'something went wrong. Please try again later')
        res.redirect('/admin/change-password')
    }
}

// Appointments Page
const appointmentsPage = async (req, res) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    var pendingAppointments = await adminServices.getPendingAppointments()
    var confirmedAppointments = await adminServices.getConfirmedAppointments()
    var rejectedAppointments = await adminServices.getRejectedAppointments()
    var cancelledAppointments = await adminServices.getCancelledAppointments()
    res.render('admin/appointments', { session: req.session, pendingAppointments, confirmedAppointments, rejectedAppointments, cancelledAppointments, err_msg, success_msg})
}

const acceptAppointment = async (req, res) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    try {
        await apptServices.appointmentAccept(req.params.id)
        req.flash('success_msg', 'Appointment is Confirmed')
        res.redirect('/admin/appointments')
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please Try again Later')
        res.redirect('/admin/appointments')
    }
}

const rejectAppointment = async (req, res) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    try {
        await apptServices.appointmentReject(req.params.id)
        req.flash('success_msg', 'Appointment is Rejected')
        res.redirect('/admin/appointments')
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please Try again Later')
        res.redirect('/admin/appointments')
    }
}

const deleteAppointment = async (req, res) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    try {
        await apptServices.appointmentDelete(req.params.id)
        req.flash('success_msg', 'Appointment is Deleted')
        res.redirect('/admin/appointments')
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please Try again Later')
        res.redirect('/admin/appointments')
    }
}

const cancelAppointment = async (req, res) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    try {
        await apptServices.appointmentCancel(req.params.id)
        req.flash('success_msg', 'Appointment is Cancelled')
        res.redirect('/admin/appointments')
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please Try again Later')
        res.redirect('/admin/appointments')
    }
}

// Doctors Page
const doctorsPage = async (req, res) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    var doctorsList = await adminServices.getDoctorList()
    var blockedDoctorList = await adminServices.getBlockedDoctorList()
    res.render('admin/doctor-list', { session: req.session, err_msg, success_msg, doctorsList, blockedDoctorList })
}

const doctorDetailsPage = async (req, res) => {
    let test = req.session.is_user_logged_in;
    let err_msg = req.flash('err_msg')
    let success_msg = req.flash('success_msg')
    if (!test) {
        return res.redirect('/')
    }
    try {
        var doctorDetails = await userServices.checkUserId(req.params.id)
        if (doctorDetails.dob == '' || doctorDetails.dob == null) {
            doctorDetails.dob = 'Not Provided'
        }
        res.render('admin/single-doctor-view', { title: 'Doctor', session: req.session, err_msg, success_msg, doctorDetails })
    } catch (error) {
        throw error
    }
}

const acceptDoctor = async (req, res) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    try {
        await adminServices.allowDoctor(req.params.id)
        req.flash('success_msg', 'Doctor is allowed and can login now')
        res.redirect('/admin/doctors-list')
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please Try again Later')
        res.redirect('/admin/doctors-list')
    }
}

const blockDoctor = async (req, res) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    try {
        await adminServices.blockDoctor(req.params.id)
        req.flash('success_msg', 'Doctor is blocked and cannot login now')
        res.redirect('/admin/doctors-list')
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please Try again Later')
        res.redirect('/admin/doctors-list')
    }
}

const deleteDoctor = async (req, res) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    try {
        await adminServices.deleteDoctor(req.params.id)
        req.flash('success_msg', 'Doctor is deleted')
        res.redirect('/admin/doctors-list')
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please Try again Later')
        res.redirect('/admin/doctors-list')
    }
}

// Exporting Modules
module.exports = {
    dashboard,
    appointmentsPage,
    acceptApplication,
    rejectApplication,
    acceptAppointment,
    rejectAppointment,
    deleteAppointment,
    cancelAppointment,
    doctorsPage,
    doctorDetailsPage,
    blockDoctor,
    deleteDoctor,
    acceptDoctor,
    passwordChangePage,
    passwordChange
}