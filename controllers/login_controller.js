const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const usersServices = require("../services/users_services");

const login = async (request, response) =>{

    const {email, password}  = request.body;
    
    const users = await usersServices.fetchByQuery({email: email}) ;
    const user = users[0];
    const passwordMatch = user.length === 0 ? false : await bcrypt.compare(password, user.passwordHash);

    if(!(user.length !==0  && passwordMatch)){
        return response.status(401).json({error : "Invalid email or password. Please check"});
    }

    const userForToken = {
        email: user.email,
        id: user.id
    }

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: "1h" });

    return response.status(201).json({
        token: token,
        user: user
    });


};

module.exports = {
    login: login
}