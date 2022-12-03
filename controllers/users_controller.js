const express = require("express");
const usersServices = require("./../services/users_services");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const getAllUsers = async (request, response) =>{
    const users = await usersServices.fetchAllUsers();  
    return response.status(200).json(users);
}

const getOneUser = async (request, response) => {
    const userId = request.params.id;

    const user = await usersServices.fetchUserById(userId);

    if(user){
        response.json(user);
    }
    else{
        response.status(404).json({
            "error": "User does not exist"
        });
    };
};


const createUser = async (request, response ) =>{
    const errors = validationResult(request);

    if(!errors.isEmpty()){

        if( errors.errors[0].param === 'email'){

            return response.status(400).json({
                errors: errors.array()
            }); 
        }

        if( errors.errors[0].param === 'password'){

            return response.status(400).json({
                errors: errors.array()
            }); 
        }
    }

    const subscriptionToAppointmentCount= {
        "individual": {
            "bronze": 7,
            "silver": 10,
            "gold": 15,
            "platinum": 20
        },
        "family": {
            "basic": 35,
            "premium": 50
        }
        
    }

    const userPasswordHash = await bcrypt.hash(request.body.password, 10);
    const userObject = {};

    userObject.email = request.body.email;
    userObject.passwordHash = userPasswordHash;
    userObject.name = request.body.name;
    userObject.role = request.body.role.trim().toLowerCase();

    if(userObject.role === 'patient'){
        userObject.subscription = request.body.subscription.trim().toLowerCase();
        userObject.subscriptionType = request.body.subscriptionType.trim().toLowerCase();
        userObject.dateOfBirth = new Date(JSON.parse(request.body.dateOfBirth.trim()));
        userObject.address = request.body.address;
        userObject.videoConsultationsLeft = subscriptionToAppointmentCount[userObject.subscriptionType][userObject.subscription];
        userObject.appointmentsLeft = Math.floor(userObject.videoConsultationsLeft / 2);
        userObject.labTestsLeft = Math.floor(userObject.videoConsultationsLeft/1.5);

    }
    else if(userObject.role === 'doctor'){
        userObject.hospitalName = request.body.hospitalName;
        userObject.specialization = request.body.specialization; 
        userObject.hospitalAddress = request.body.hospitalAddress;
    }

    const createdUser = await usersServices.createUser(userObject);
    if(!createdUser){
        return response.status(500).json({
            error: "Something went wrong. Please try again"
        })
    }
    else{
        return response.status(200).json(createdUser);
    }

}

const deleteUser = async (request, response) =>{
    const userId = request.params.id;
    const user = await usersServices.fetchUserById(userId);
    if(!user){
        return response.status(400).json({
            error: "User with specified email does not exist. Please check"
        });
    }
    else{
        const deletedUser = await usersServices.removeUser(userId);
        if(deletedUser)
            return response.status(200).send();
        else
            return response.status(500).json({
                error: "Something went wrong. Please try again"
            });
    }

}

const updateUser = async (request, response) =>{
    const userId = request.params.id;
    const errors = validationResult(request);

    const user = await usersServices.fetchUserById(userId);
    if(!user){
        return response.status(400).json({
            error: "User with the specified id does not exist"
        });
    }

    if(!errors.isEmpty()){

        if( errors.errors[0].param === 'password'){

            return response.status(400).json({
                errors: errors.array()
            }); 
        }
    }
    if(request.body.password){
        user.passwordHash = await bcrypt.hash(request.body.password, 10);
    }
    user.name = request.body.name ?? user.name;


    if(user.role === "patient"){
        if(request.body.subscription)
            user.subscription = request.body.subscription.trim().toLowerCase();
        if(request.body.dateOfBirth)
            user.dateOfBirth = new Date(JSON.parse(request.body.dateOfBirth));
        if(request.body.address)
            user.address = request.body.address;
        if(request.body.appointmentsLeft)
            user.appointmentsLeft = new Number(request.body.appointmentsLeft);
        if(request.body.videoConsultationsLeft)
            user.videoConsultationsLeft = new Number(request.body.videoConsultationsLeft);
        if(request.body.labTestsLeft)
            user.labTestsLeft = new Number(request.body.labTestsLeft);
    }

    if(user.role === "doctor"){
        if(request.body.hospitalName)
            user.hospitalName = request.body.hospitalName.trim().toLowerCase();
        if(request.body.hospitalAddress)
            user.hospitalAddress = request.body.hospitalAddress;
        if(request.body.specialization)
            user.specialization = request.body.specialization.trim().toLowerCase();
    }

    const updatedUser = await user.save();

    if(!updatedUser){
        return response.status(500).json({
            error: "Something went wrong. Please try again"
        })
    }
    else{
        return response.status(200).json(updatedUser);
    }
}


module.exports = {
    getAllUsers: getAllUsers,
    getOneUser: getOneUser,
    createUser: createUser,
    deleteUser: deleteUser,
    updateUser: updateUser
};
