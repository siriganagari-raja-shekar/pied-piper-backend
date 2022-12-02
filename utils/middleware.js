const jwt = require("jsonwebtoken");
const usersServices = require("./../services/users_services");
const errorHandler = (error, request, response, next) =>{
    console.log(error.message);

    if(error.name === "ValidationError"){
        return response.status(400).send({error: error.message});
    }
    else if(error.name === "JsonWebTokenError"){
        return response.status(401).send({error: "Invalid token"});
    }
    else if(error.name === "TokenExpiredError"){
        return response.status(401).send({error : "Token expired"});
    }
    next(error);
}

const userExtractor = async (request, response, next) =>{
    const authorization = request.get("authorization");
    if(authorization && authorization.toLowerCase().startsWith("bearer ")){
        const token = authorization.substring(7);
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if(!decodedToken.id){
            return response.status(201).json({error: "Token missing or invalid"})
        }
        request.user = await usersServices.fetchUserById(decodedToken.id);
    }
    else{
        response.status(401).json({error: "Authorization missing or unauthorized access"});
    }
    next();
}
module.exports = { errorHandler, userExtractor };