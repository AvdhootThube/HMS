const moment = require('moment')
const { Appointment } = require('../models/appointment')
const { userInfo, User } = require("../models/User");


const bookAppointment = async (appointmentDetails, doctorDetails) => {
    var dateTime = moment(appointmentDetails.apptDateTime).format('DD/MM/YYYY hh:mm a')
    const appointmentDetailsObj = {
        patientName: appointmentDetails.name,
        patientEmail: appointmentDetails.email,
        doctorName: doctorDetails.name,
        doctorEmail: doctorDetails.email,
        dateTime: dateTime,
        reason: appointmentDetails.reason,
        department: appointmentDetails.dept
    }
    try {
        const appointmentDetails = new Appointment(appointmentDetailsObj)
        appointmentDetails.save()
        return appointmentDetailsObj
    } catch (error) {
        throw error
    }
}

const getRandomDoctor = async (dept) => {
    let doctorEmails = await User.find( {role: 'doctor', department: dept}, 'email')
    let doctorEmail = doctorEmails[Math.floor(Math.random() * doctorEmails.length)]
    return doctorEmail
}

const fetchAppointments = async (userEmail) => {
    var appts = await Appointment.find({ patientEmail: userEmail }).sort([['dateTime', 1]])
    return appts
}

const appointmentAccept = async (id) => {
    await Appointment.findByIdAndUpdate(id, { apptStatus: 'Confirmed' })
}

const appointmentReject = async (id) => {
    await Appointment.findByIdAndUpdate(id, { apptStatus: 'Rejected' })
}

const appointmentDelete = async (id) => {
    await Appointment.findByIdAndDelete(id)
}

const appointmentCancel = async (id) => {
    await Appointment.findByIdAndUpdate(id, { apptStatus: 'Cancelled' })
}

module.exports = {
    bookAppointment,
    getRandomDoctor,
    fetchAppointments,
    appointmentAccept,
    appointmentReject,
    appointmentDelete,
    appointmentCancel
}