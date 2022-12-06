const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    }
});

userSchema.set("toJSON", {
    transform: (doc, ret)=>{
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        if(ret.__t)
            delete ret.__t;
        delete ret.passwordHash
    }
});

const User = mongoose.model("User",userSchema);

const addressSchema = mongoose.Schema({
    streetAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    }
});

addressSchema.set("toJSON", {
    transform: (doc, ret)=>{
        delete ret._id;
    }
});

const Patient = User.discriminator("Patient", new mongoose.Schema({
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    subscription: {
        type: String,
        required: true
    },
    subscriptionType: {
        type: String,
        required: true
    },
    address: {
        type: addressSchema,
        required: true,
    },
    appointmentsLeft: {
        type: Number,
        required: true
    },
    videoConsultationsLeft: {
        type: Number,
        required: true
    },
    labTestsLeft: {
        type: Number,
        required: true
    }
}));

const Doctor = User.discriminator("Doctor", new mongoose.Schema({
    hospitalName: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    hospitalAddress: {
        type: addressSchema,
        required: true
    }
}));

module.exports = {
    User: User,
    Doctor: Doctor,
    Patient: Patient
}