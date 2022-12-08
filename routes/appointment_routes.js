const express = require("express");
const appointmentRouter = express.Router();
const appointmentController = require("./../controllers/appointments_controller");
const middleware = require("./../utils/middleware");

appointmentRouter.get("/", middleware.userExtractor,appointmentController.getAppointments);
appointmentRouter.get("/:id", appointmentController.getAppointment);
appointmentRouter.post("/", middleware.userExtractor, appointmentController.createAppointment);
appointmentRouter.put("/:id/vitals",middleware.userExtractor, appointmentController.updateVitals);
appointmentRouter.delete("/:id",middleware.userExtractor, appointmentController.deleteAppointment);
appointmentRouter.post("/:id/comments", middleware.userExtractor, appointmentController.addCommentToAppointment);
appointmentRouter.put("/:id/prescription", middleware.userExtractor, appointmentController.updatePrescription);
appointmentRouter.put("/:id/labs", middleware.userExtractor, appointmentController.addLabResult);

module.exports = appointmentRouter;