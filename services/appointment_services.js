const { Appointment } = require("./../models/appointment");
const logger = require("./../utils/logger");
const mongoose = require("mongoose");


const createAppointment = async (appointmentObject) =>{

    const appointment = new Appointment(appointmentObject);
    return await appointment.save().populate("doctor").populate("patient");
}

const getSingleAppointment = async (id)=>{
    const appointment = await Appointment.findById(id).populate("doctor").populate("patient");
    return appointment;
}

const updateAppointment = async (appointment)=>{
    return await appointment.save();
}

const deleteAppointment = async (id)=>{
    return await Appointment.findByIdAndDelete(id);
}

const getAppointmentsByQuery = async (query) => {

    if(query.patient){
        query.patient = mongoose.Types.ObjectId(query.patient);
    }
    if(query.doctor){
        query.doctor = mongoose.Types.ObjectId(query.doctor);
    }

    const appointments =  await Appointment.find(query).populate("doctor").populate("patient");

    return appointments;
}


module.exports = {
    createAppointment: createAppointment,
    getSingleAppointment: getSingleAppointment,
    updateAppointment: updateAppointment,
    deleteAppointment: deleteAppointment,
    getAppointmentsByQuery: getAppointmentsByQuery
}