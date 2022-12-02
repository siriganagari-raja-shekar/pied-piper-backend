const usersServices = require("../services/users_services");
const appointmentServices = require("./../services/appointment_services");



const getAppointments = async (request, response) =>{
    const query = request.query;
    const user = request.user;

    if(!query.doctorID || !query.patientID){
        return response.status(400).json({
            error: "Query parameters invalid. Give patient or doctor ID to retrieve their appointments"
        });
    }
    
    if(user.role === "doctor" && query.doctorID){
       return await appointmentServices.getAppointmentsByQuery({doctor: query.doctorID});
    }
    else if((user.role === "doctor" || user.role==="patient") && query.patientID){
        return await appointmentServices.getAppointmentsByQuery({patient: query.patientID});
    }
}
const createAppointment = async (request, response)  => {

    const user = request.user;

    if(user.role !== "patient"){
        return response.status(403).json({
            error: "Only patients can create appointments"
        })
    }
    const body = request.body;
    if(!body.doctor || !body.time){
        return response.status(400).json({
            error: "Please provide doctor id and time to book an appointment"
        })
    }

    const doctor = await usersServices.fetchUserById(body.doctor);
    const appointmentObj = {
        patient: user._id,
        doctor: doctor._id,
        time: new Date(JSON.parse(body.time)),
        comments: [],
        vitals: {
        }
    }

    const createdAppointment = await appointmentServices.createAppointment(appointmentObj);

    if(!createdAppointment){
        return response.status(500).json({
            error: "Something went wrong. Please try again"
        });
    }
    else{
        return response.status(200).json(createdAppointment);
    }

}

const updateVitals = async (request, response)=>{

    const user = request.user;
    const body = request.body;
    if(user.role !== "doctor"){
        return response.status(401).json({
            error: "User not authorized to update vitals in appointment"
        });
    }

    const appointment = await appointmentServices.getSingleAppointment(request.params.id);

    if(!appointment){

        return response.status(404).json({
            error: "Appointment not found"
        });
    }
    
    const vitals = {
        bloodPressure: body.bloodPressure || appointment.vitals.bloodPressure,
        pulse: body.pulse || appointment.vitals.pulse,
        temperature: body.temperature || appointment.vitals.temperature,
        bloodOxygenLevel: body.bloodOxygenLevel || appointment.vitals.bloodOxygenLevel
    }

    appointment.vitals = vitals;

    const updatedAppointment = await appointmentServices.updateAppointment(appointment);

    if(!updatedAppointment){
        return response.status(500).json({
            error: "Something went wrong. Please try again later"
        });
    }
    else{
        return response.status(200).json(updatedAppointment);
    }
}

const deleteAppointment = async (request, response)=>{

    const deletedAppointment = await appointmentServices.deleteAppointment(request.params.id);
    if(!deletedAppointment){
        return response.status(404).json({
            error: "Appointment not found"
        });
    }
    else{
        return response.status(204).send();
    }
}


module.exports = {
    createAppointment: createAppointment,
    updateVitals: updateVitals,
    deleteAppointment: deleteAppointment,
    getAppointments: getAppointments
}