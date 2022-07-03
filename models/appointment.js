const mongoose = require('mongoose')

const appointmentSchema = mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    patientEmail: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    doctorEmail: {
        type: String,
        required: true
    },
    dateTime: {
        type: String,
        required: true
    },
    apptStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Rejected'],
        default: 'Pending'
    },
    reason:{
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Appointment = mongoose.model('Appointments', appointmentSchema);

module.exports = {
    Appointment
}