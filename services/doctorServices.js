const { Appointment } = require('../models/appointment')

const fetchAppts = async (userEmail) => {
    var appts = await Appointment.find({ doctorEmail: userEmail, apptStatus: 'Confirmed' }).sort([['dateTime', 1]])
    return appts
}

module.exports = {
    fetchAppts
}