const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
    
    time: {
        type: Date,
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    vitals: {
        bloodPressure: {
            type: String,
            // required: true
        },
        pulse: {
            type: String,
            // required: true
        },
        temperature: {
            type: String,
            // required: true
        },
        bloodOxygenLevel: {
            type: String,
            // required: true
        }
    },
    comments: [{
        body: String,
        timePosted: Date,
        by: String
    }]
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = {
    Appointment: Appointment
}