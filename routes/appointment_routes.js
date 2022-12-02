const express = require("express");
const appointmentRouter = express.Router();
const appointmentController = require("./../controllers/appointments_controller");
const middleware = require("./../utils/middleware");

appointmentRouter.get("/", appointmentController.getAppointments);
appointmentRouter.post("/", middleware.userExtractor, appointmentController.createAppointment);
appointmentRouter.put("/:id/vitals", appointmentController.updateVitals);
appointmentRouter.delete("/:id", appointmentController.deleteAppointment);


module.exports = appointmentRouter;