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
    dateOfBirth:{
        type: Date,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    toJson: {
        transform: (doc, ret)=>{
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

const User = mongoose.model("User",userSchema);

export default User;