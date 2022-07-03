const session = require('express-session');
const res = require('express/lib/response');
const request = require('request')
const apptServices = require('../services/apptServices')
const userServices = require('../services/userServices')
const doctorServices = require('../services/doctorServices');

const dashboard = async (req, res, next) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    let err_msg = req.flash('err_msg')
    let success_msg = req.flash('success_msg')
    var appts = await doctorServices.fetchAppts(req.session.email)
    res.render('doctor/dashboard',{ session: req.session, appts, err_msg, success_msg });
}

const cancelAppointment = async (req, res) => {
    try {
        await apptServices.appointmentCancel(req.params.id)
        req.flash('success_msg','Appointment is cancelled')
        res.redirect('/doctor/dashboard')
    } catch (error) {
        req.flash('err_msg','Something went Wrong. Please try again later.')
        res.redirect('/doctor/dashboard')
    }
}

// Edit Profile
const editProfilePage = async (req, res, next) => {
    let test = req.session.is_user_logged_in;
    if (!test) {
        return res.redirect('/')
    }
    let err_msg = req.flash('err_msg')
    let success_msg = req.flash('success_msg')
    var user = await userServices.checkUser(req.session.email)
    return res.render('doctor/edit-profile',{ session: req.session, err_msg, success_msg, user });
}

const submitProfileChanges = async (req, res) => {
    try {
        if (req.body.mobile_no !== '' && req.body.mobile_no !== null){
            let checkMobNo = await userServices.validateMobileNo(req.body.mobile_no)
            if (!checkMobNo) {
                req.flash('err_msg', 'Invalid Mobile Number')
                return res.redirect('/doctor/edit-profile');
            }
        }
        if (req.body.dob != '' && req.body.dob != null){
            let checkDOB = await userServices.validateDOB(req.body.dob)
            if (!checkDOB) {
                req.flash('err_msg', 'Invalid Date of Birth format')
                return res.redirect('/doctor/edit-profile');
            }
        }
        await userServices.updateProfile(req.session.email, req.body)
        req.flash('success_msg', 'Profile updated successfully')
        res.redirect('/doctor/edit-profile')
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please Try again later')
        res.redirect('/doctor/edit-profile')
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
    res.render('doctor/change-password', { title: 'Change Password', session: req.session, err_msg, success_msg })
}

const passwordChange = async (req, res) => {
    var currentPass = await userServices.createCipher(req.body.currentPass)
    var newPass = await userServices.createCipher(req.body.newPassword)
    var confNewPass = await userServices.createCipher(req.body.confNewPass)
    var user = await userServices.checkUser(req.session.email)
    if (currentPass != user.password) {
        req.flash('err_msg', 'Please enter correct password')
        return res.redirect('/doctor/change-password')
    }
    if (currentPass == newPass) {
        req.flash('err_msg', 'Current password and new password cannot be same')
        return res.redirect('/doctor/change-password')
    }
    if (confNewPass != newPass) {
        req.flash('err_msg', 'New Password and Confirm Password does not match')
        return res.redirect('/doctor/change-password')
    }
    try {
        await userServices.changePassword(req.session.email, newPass)
        req.flash('success_msg', 'Password changed successfully')
        res.redirect('/doctor/change-password')
    } catch (error) {
        req.flash('err_msg', 'something went wrong. Please try again later')
        res.redirect('/doctor/change-password')
    }
}

module.exports = {
    dashboard,
    editProfilePage,
    submitProfileChanges,
    passwordChangePage,
    passwordChange,
    cancelAppointment
}