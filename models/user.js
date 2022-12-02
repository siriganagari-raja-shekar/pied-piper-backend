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
    role: {
        type: String,
        requried: true
    },
});

userSchema.set("toJSON", {
    transform: (doc, ret)=>{
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        if(ret.__t)
            delete ret.__t;
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
    subscription: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    address: {
        type: addressSchema,
        required: true,
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