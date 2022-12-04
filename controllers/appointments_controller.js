const usersServices = require("../services/users_services");
const appointmentServices = require("./../services/appointment_services");
const logger = require("./../utils/logger");


const getAppointments = async (request, response) =>{
    const query = request.query;
    const user = request.user;

    if(!query.doctorID && !query.patientID){
        return response.status(400).json({
            error: "Query parameters invalid. Give patient or doctor ID to retrieve their appointments"
        });
    }
    // logger.info(query);
    
    if(user.role === "doctor" && query.doctorID){
       const appointments= await appointmentServices.getAppointmentsByQuery({doctor: query.doctorID});
       return response.status(200).json(appointments);
    }
    else if((user.role === "doctor" || user.role==="patient") && query.patientID){
        // logger.info("Getting patient appointments");
        const appointments =  await appointmentServices.getAppointmentsByQuery({patient: query.patientID});
        return response.status(200).json(appointments);
    }
    else{
        return response.status(401).json({
            error: "Unauthorized to make this request"
        })
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
        appointmentType: body.appointmentType,
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

const addCommentToAppointment = async (request, response)=>{

    const appointment = await appointmentServices.getSingleAppointment(request.params.id);
    const user = request.user;
    const body = request.body;
    if(!appointment){
        return response.status(404).json({
            error: "Appointment not found"
        })
    }

    if(!body.body || !body.by || !body.timePosted){
        return response.status(400).json({
            error: "Comment must have body, by and timePosted attributes"
        })
    }

    if(body.by.trim().toLowerCase() !== user.role){
        return response.status(401).json({
            error: "Unauthorized to post a comment from another source"
        })
    }

    if(user.id !== appointment.patient.toString() && user.id !== appointment.doctor.toString()){
        return response.status(401).json({
            error: "Unauthorized to post a comment from another source"
        })
    }

    const comment = {
        body: body.body,
        by: body.by,
        timePosted: new Date(JSON.parse(body.timePosted))
    };

    appointment.comments.push(comment);

    const updatedAppointment = await appointmentServices.updateAppointment(appointment);

    if(!updatedAppointment){
        return response.status(500).json({
            error: "Something went wrong. Please try again"
        });
    }
    else{
        return response.status(200).json(updatedAppointment);
    }
}

const updatePrescription = async(request, response)=>{

    const appointment = await appointmentServices.getSingleAppointment(request.params.id);
    const user = request.user;
    const body = request.body;

    if(user.role !== "doctor" || user.id !== appointment.doctor.toString()){
        return response.status(401).json({
            error: "Unauthorized to post update the prescription"
        }) 
    }

    if(!body.problemDiagnosed || !body.meds){
        return response.status(400).json({
            error: "Please enter prescription in correct format"
        })
    }

    const prescription = {
        problemDiagnosed: body.problemDiagnosed,
        meds: body.meds
    }

    appointment.prescription = prescription;

    const updatedAppointment = await appointmentServices.updateAppointment(appointment);

    if(!updatedAppointment){
        return response.status(500).json({
            error: "Something went wrong. Please try again"
        });
    }
    else{
        return response.status(200).json(updatedAppointment);
    }
}

const addLabResult = async(request, response)=>{

    const appointment = await appointmentServices.getSingleAppointment(request.params.id);
    const user = request.user;
    const body = request.body;

    if(user.role !== "doctor" || user.id !== appointment.doctor.toString()){
        return response.status(401).json({
            error: "Unauthorized to post update the lab results"
        }) 
    }

    if(!body.testType || !body.time){
        return response.status(400).json({
            error: "Please enter lab result in correct format"
        })
    }

    const lab = {
        testType: body.testType,
        time: new Date(JSON.parse(body.time))
    }

    appointment.labs.push(lab);

    const updatedAppointment = await appointmentServices.updateAppointment(appointment);

    if(!updatedAppointment){
        return response.status(500).json({
            error: "Something went wrong. Please try again"
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
    getAppointments: getAppointments,
    addCommentToAppointment: addCommentToAppointment,
    updatePrescription: updatePrescription,
    addLabResult: addLabResult
}