const express = require("express");
const loginController = require("./../controllers/login_controller");
const loginRouter = express.Router();

loginRouter.post("/", loginController.login);

module.exports = loginRouter;