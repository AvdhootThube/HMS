const nodemailer = require("nodemailer");
const userServices = require("../services/userServices");

const sendEmailVerification = async (req, res) => {
    var otp = await userServices.updateOTP(req.session.email);
    let OTPOutput = `
        <p>Dear ${req.session.name},</p><br>
        <p>Thank you for signing up to HMS, Please verify your email with the following OTP to access your account:</p>
        <h4>${otp}</h4>
        <p>Thanks & Regards,</p>
        <p>Team HMS</p>
    `;
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {
            user: "nocontacthms@gmail.com",
            pass: "muopnfvzczbtbcsf"
        }
    });
    let info = await transporter.sendMail({
        from: "nocontacthms@gmail.com",
        to: req.session.email,
        subject: "[HMS] Please verify your email",
        html: OTPOutput,
    });
    if (info) {
        req.flash('success_msg', 'OTP has been sent to your registered Email id')
        return res.redirect('/otp-verification-page')
    }
    req.flash('err_msg', 'Error Sending the OTP. Please try again later')
    return res.redirect('/')
};

const forgotPasswordVerificationEmail = async (req, res) => {
    var otp = await userServices.updateOTP(req.session.email);
    let OTPOutput = `
        <p>Dear ${req.session.name},</p><br>
        <p>A request has been made to reset the password of ${req.session.email}, Please verify with the following OTP to proceed: </p>
        <h4>${otp}</h4>
        <p>Thanks & Regards,</p>
        <p>Team HMS</p>
    `;
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {
            user: "nocontacthms@gmail.com",
            pass: "muopnfvzczbtbcsf"
        }
    });
    let info = await transporter.sendMail({
        from: "nocontacthms@gmail.com",
        to: req.session.email,
        subject: "[HMS] Reset Password",
        html: OTPOutput,
    });
    if (info) {
        req.flash('success_msg', 'OTP has been sent to your registered Email id')
        return res.redirect('/verification-page')
    }
    req.flash('err_msg', 'Error Sending the OTP. Please try again later')
    return res.redirect('/')
}

module.exports = {
    sendEmailVerification,
    forgotPasswordVerificationEmail
};
