require("express-async-errors");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const config = require("./utils/config");
const usersRouter = require("./routes/users_routes");
const loginRouter = require("./routes/login_routes");
const appointmentRouter = require("./routes/appointment_routes");
const paymentRouter = require("./routes/payment_routes");

logger.info("Connecting to", config.MONGODB_URI); 
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info("Connected to MongoDB");  
    })  
    .catch((error) => {
        logger.info("Error connecting to MongoDB:", error.message);  
    });


const app = express();

app.use(cors());
app.use(express.json());
app.use(logger.requestLogger);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/payment", paymentRouter);

module.exports = app;
