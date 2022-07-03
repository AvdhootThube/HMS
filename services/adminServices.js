// const mongoose = require('mongoose')
const moment = require('moment')
const { Appointment } = require('../models/appointment')
const { User } = require("../models/User");

const getPendingApplications = async () => {
    var pendingApplications = await User.find({ role: 'doctor', adminVerification: 'pending' }).sort({_id: 1})
    return pendingApplications
}

// Appointments Services
const getPendingAppointments = async () => {
    var pendingAppointments = await Appointment.find({ apptStatus: 'Pending' }).sort({_id: 1})
    return pendingAppointments
}

const getConfirmedAppointments = async () => {
    var confirmedAppointments = await Appointment.find({ apptStatus: 'Confirmed' }).sort({_id: 1})
    return confirmedAppointments
}

const getRejectedAppointments = async () => {
    var rejectedAppointments = await Appointment.find({ apptStatus: 'Rejected' }).sort({_id: 1})
    return rejectedAppointments
}

const getCancelledAppointments = async () => {
    var cancelledAppointments = await Appointment.find({ apptStatus: 'Cancelled' }).sort({_id: 1})
    return cancelledAppointments
}

// Application Services
const doctorApplicationAccept = async (id) => {
    await User.findByIdAndUpdate(id, { adminVerification: 'verified'})
}

// Doctors Services
const getDoctorList = async () => {
    var verifiedDoctorsList = await User.find( { role: 'doctor', adminVerification: 'verified'}).sort({name: 1})
    return verifiedDoctorsList
}

const getBlockedDoctorList = async () => {
    var deletedDoctorsList = await User.find( { role: 'doctor', adminVerification: 'blocked'}).sort({name: 1})
    return deletedDoctorsList
}

const blockDoctor = async (id) => {
    var updateInfo = {
        adminVerification: 'blocked'
    }
    await User.findByIdAndUpdate(id, updateInfo)
}

const deleteDoctor = async (id) => {
    let user = await User.findById(id)
    var appts = await Appointment.find({ doctorEmail: user.email})
    for (let i = 0; i < appts.length; i++) {
        await Appointment.findByIdAndDelete(appts[i]._id)
    }
    await User.findByIdAndDelete(id)
}

const allowDoctor = async (id) => {
    var updateInfo = {
        adminVerification: 'verified'
    }
    await User.findByIdAndUpdate(id, updateInfo)
}

module.exports = {
    getPendingApplications,
    getPendingAppointments,
    getConfirmedAppointments,
    getRejectedAppointments,
    getCancelledAppointments,
    doctorApplicationAccept,
    getDoctorList,
    getBlockedDoctorList,
    blockDoctor,
    deleteDoctor,
    allowDoctor
}