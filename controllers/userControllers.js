const { log } = require('debug/src/browser');
const { User } = require('../models/User');
const request = require('request');
const userServices = require('../services/userServices')

// Home Page or Index Page
const indexPage = async (req, res) => {
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    res.render('index', { err_msg, success_msg });
}

const userLogin = async (req, res) => {
    let user = await userServices.checkUser(req.body.email);
    if (user) {
        let userRole = await user.role
        let password = req.body.password;
        let mystr = await userServices.createCipher(password);
        let userLogin = await userServices.checkUserPass(req.body.email, mystr);
        if (userLogin) {
            let email_status = userLogin.email_verify_status;
            
            req.session.success = true;
            req.session._id = userLogin._id;
            req.session.name = userLogin.name;
            req.session.email = userLogin.email;
            req.session.role = userRole;
            req.session.is_user_logged_in = true;
            if (email_status == 'Verified') {
                switch (userRole) {
                    case 'patient':
                        if (userLogin.deleted == '1') {
                            req.flash('err_msg', 'User is blocked by ' + userLogin.deleted_by + ' at ' + userLogin.deleted_at + '. Please contact hospital for further assisstance.')
                            return res.redirect('/')
                        }
                        res.redirect("/patient/book-appointment");
                        break;
                    case 'doctor':
                        if (userLogin.deleted == '1') {
                            req.flash('err_msg', 'User is deleted by ' + userLogin.deleted_by + ' at ' + userLogin.deleted_at + '. Please contact hospital for further assisstance.')
                            res.redirect('/')
                        }else if (userLogin.adminVerification == 'verified') {
                            res.redirect("/doctor/dashboard");
                        } else {
                            req.flash('err_msg','Hospital Admin has not verified your details. Please wait for them to verify or contact the hospital.')
                            res.redirect('/')
                        }
                        break;
                    case 'admin':
                        res.redirect("/admin/dashboard")
                        break;
                    default:
                        req.flash('err_msg', 'Your role is not defined. Please write to us at infohmars@gmail.com to update your role.')
                        res.redirect('/')
                        break;
                }
            } else {
                req.flash('err_msg', 'Your account is not verified.');
                res.redirect('/send-email')
            }
        }
        else {
            req.flash('err_msg', 'The username or password is incorrect.');
            res.redirect('/')
        }
    }
    else {
        req.flash('err_msg', 'User does not exist');
        res.redirect('/');
    }
}

const forgotPassPage = async (req, res) => {
    let err_msg = req.flash('err_msg')
    let success_msg = req.flash('success_msg')
    res.render('forgot-password', { success_msg, err_msg })
}

const submitForgotPassword = async (req, res) => {
    try {
        let user = await userServices.checkUser(req.body.email);
        if (!user) {
            req.flash('err_msg', 'User doesn\'t exist.');
            res.redirect('/forgot-pass');
        }
        else {  
            req.session.success = true;
            req.session.id = user._id;
            req.session.name = user.name;
            req.session.email = user.email;
            
            res.redirect('/forgot-password-verification-email');
        }
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please Try Again.');
        res.redirect('/forgot-pass');
    }
}

const forgotPasswordVerification = (req, res) => {
    let err_msg = req.flash('err_msg')
    let success_msg = req.flash('success_msg')
    res.render("forgot-password-verification", { err_msg, success_msg });
}

const submitForgotPasswordVerification = async (req, res) => {
    let getOTP = await userServices.getOTP(req.session.email)
    let otp = await req.body.otp
    if (getOTP.otp == otp) {
        req.session.is_otp_verified = true
        return res.redirect('/set-new-password')
    }
    req.flash('err_msg','Invalid OTP.')
    return res.redirect('/forgot-password-verification-page')
}

const setNewPasswordPage = async (req, res) => {
    let err_msg = req.flash('err_msg')
    let success_msg = req.flash('success_msg')
    if (req.session.is_otp_verified) {
        return res.render('set-new-password', { err_msg, success_msg })
    }
    res.redirect('/forgot-pass')
}

const submitSetNewPassword = async (req, res) => {
    var user = await userServices.checkUser(req.session.email)
    var newPassword = await userServices.createCipher(req.body.password)
    var confirmPassword = await userServices.createCipher(req.body.confirmPassword)
    if (user.password == newPassword) {
        req.flash('err_msg', 'Current password and new password cannot be same')
        return res.redirect('/set-new-password')
    }
    if (newPassword != confirmPassword) {
        req.flash('err_msg', 'New Password and Confirm Password does not match')
        return res.redirect('/set-new-password')
    }
    try {
        await userServices.changePassword(req.session.email, newPassword)
        req.flash('success_msg', 'Password changed successfully!')
        req.session.is_otp_verified = false
        res.redirect('/')
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please try again later')
        res.redirect('/set-new-password')
    }
}

const doctorSignupPage = async (req, res) => {
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    res.render('signup-doctor', { err_msg, success_msg });

}
const patientSignupPage = async (req, res) => {
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    res.render('signup-patient', { err_msg, success_msg});

}

const submitPatientRegistration = async (req, res) => {
    try {
        let user = await userServices.checkUser(req.body.email);
        if (user) {
            req.flash('err_msg', 'Email already exists. Try signing up with different Email Address.');
            return res.redirect('/patient-signup');
        }
        else {
            if (req.body.password === req.body.confirmPassword) {
                let mystr = await userServices.createCipher(req.body.password);
                await userServices.addPatient(req.body, mystr);
                let user = await userServices.checkUser(req.body.email);
                req.session.success = true;
                req.session._id = user._id;
                req.session.name = user.name;
                req.session.email = user.email;
                req.session.role = user.role;
                req.session.is_user_logged_in = true;
                
                res.redirect('/send-email');
            }
            else {
                req.flash('err_msg', 'Password does not match.');
                return res.redirect('/patient-signup');
            }
        }
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please Try Again.');
        return res.redirect('/patient-signup');
    }

}

const submitDoctorRegistration = async (req, res) => {
    try {
        let user = await userServices.checkUser(req.body.email);
        if (user) {
            req.flash('err_msg', 'Email already exists. Try signing up with different Email Address.');
            return res.redirect('/doctor-signup');
        }
        else {
            if (req.body.password === req.body.confirmPassword) {
                let mystr = await userServices.createCipher(req.body.password);
                await userServices.addDoctor(req.body, mystr);
                let user = await userServices.checkUser(req.body.email);
                req.session.success = true;
                req.session._id = user._id;
                req.session.name = user.name;
                req.session.email = user.email;
                req.session.role = user.role;
                req.session.is_user_logged_in = true;
                
                res.redirect('/send-email');
            }
            else {
                req.flash('err_msg', 'Password does not match.');
                return res.redirect('/doctor-signup');
            }
        }
    } catch (error) {
        req.flash('err_msg', 'Something went wrong. Please Try Again.');
        return res.redirect('/doctor-signup');
    }

}

const authPage = async (req, res) => {
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    res.render("otp-verification", {err_msg, success_msg});
};

const submitAuthPage = async (req, res) => {
    let getOTP = await userServices.getOTP(req.session.email)
    let otp = await req.body.otp
    if (getOTP.otp == otp) {
        await User.findOneAndUpdate({ email: req.session.email }, { email_verify_status: 'Verified', otp: '' })
        switch (req.session.role) {
            case 'patient':
                res.redirect("/patient/book-appointment");
                break;
            case 'doctor':
                await User.findOneAndUpdate({ email: req.session.email }, { adminVerification: 'pending' })
                req.flash('success_msg','You have successfully signed up. Please wait for the admin to verify your details')
                res.redirect('/')
                break;
            case 'admin':
                res.redirect("/admin/dashboard");
                break;
            default:
                req.flash('err_msg', 'Your role is not defined. Please write to us at support@hmars.com to update your role.')
                res.redirect('/')
                break;
        }
    } else {
        req.flash('err_msg','Invalid OTP.')
        res.redirect('/otp-verification-page')
    }
}

const userLogOut = async (req, res) => {
    await req.session.destroy((err) => {
        if (err) {
            return req.flash('err_msg', 'Unable to logout of this session')
        }
        res.redirect('/')
    })
}

module.exports = {
    indexPage,
    doctorSignupPage,
    patientSignupPage,
    submitPatientRegistration,
    submitDoctorRegistration,
    authPage,
    submitAuthPage,
    userLogin,
    userLogOut,
    forgotPassPage,
    submitForgotPassword,
    forgotPasswordVerification,
    submitForgotPasswordVerification,
    setNewPasswordPage,
    submitSetNewPassword
};