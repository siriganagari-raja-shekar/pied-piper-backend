const express = require("express");
const paymentController = require("./../controllers/payment_controller");
const paymentRouter = express.Router();

paymentRouter.get("/config", paymentController.getConfig);
paymentRouter.post("/create-payment-intent", paymentController.createPaymentIntent);

module.exports = paymentRouter;