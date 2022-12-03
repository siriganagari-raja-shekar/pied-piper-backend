const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    timePosted: {
        type: Date,
        required: true
    },
    by:{
        type: String,
        required: true
    }
    
})

commentSchema.set("toJSON", {
    transform: (doc, ret)=>{
        ret.id = ret._id;
        delete ret._id;
    }
});

const medSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    timeOfDayToTake: {
        type: String,
        required: true
    }
})

medSchema.set("toJSON", {
    transform: (doc, ret)=>{
        ret.id = ret._id;
        delete ret._id;
    }
});

const prescriptionSchema = mongoose.Schema({

    problemDiagnosed: {
        type: String,
        required: true,
    },
    meds: [
        {
            type: medSchema
        }
    ]
});

prescriptionSchema.set("toJSON", {
    transform: (doc, ret)=>{
        ret.id = ret._id;
        delete ret._id;
    }
});

const labSchema = mongoose.Schema({

    testType: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
});

labSchema.set("toJSON", {
    transform: (doc, ret)=>{
        ret.id = ret._id;
        delete ret._id;
    }
});

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
    prescription: {
        type: prescriptionSchema
    },
    labs: [
        {
            type: labSchema
        }
    ],
    comments: [{
        type: commentSchema
    }]
});
appointmentSchema.set("toJSON", {
    transform: (doc, ret)=>{
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = {
    Appointment: Appointment
}