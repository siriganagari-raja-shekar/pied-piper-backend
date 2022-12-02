const { Appointment } = require("./../models/appointment");

const createAppointment = async (appointmentObject) =>{

    const appointment = new Appointment(appointmentObject);
    return await appointment.save();
}

const getSingleAppointment = async (id)=>{
    const appointment = await Appointment.findById(id);
    return appointment;
}

const updateAppointment = async (appointment)=>{
    return await appointment.save();
}

const deleteAppointment = async (id)=>{
    return await Appointment.findByIdAndDelete(id);
}

const getAppointmentsByQuery = async (query) => {
    return await Appointment.find(query);
}

module.exports = {
    createAppointment: createAppointment,
    getSingleAppointment: getSingleAppointment,
    updateAppointment: updateAppointment,
    deleteAppointment: deleteAppointment,
    getAppointmentsByQuery: getAppointmentsByQuery
}