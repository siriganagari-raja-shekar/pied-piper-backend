const info = (...params) => {
    // if(process.env.NODE_ENV !== "test"){
    //     console.log(params);
    // }
    console.log(params);
};

const error = (...params) => {
    // if(process.env.NODE_ENV !== "test"){
    //     console.log(params);
    // }
    
    console.log(params);
};

const requestLogger = (require("morgan"))("tiny");

module.exports = { info, error, requestLogger };