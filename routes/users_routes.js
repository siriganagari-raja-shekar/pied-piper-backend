const express = require("express");
const usersController = require("./../controllers/users_controller")
const validators = require("./../utils/validators");
const middleware = require("./../utils/middleware");
const usersRouter = express.Router();


usersRouter.get("/", usersController.getAllUsers);
usersRouter.get("/cities", usersController.getCities);
usersRouter.get("/doctors", usersController.getDoctorsByCity);
usersRouter.get("/:id", usersController.getOneUser);
usersRouter.post("/", validators.emailValidator, validators.passwordValidator, usersController.createUser);
usersRouter.delete("/:id", middleware.userExtractor,usersController.deleteUser);
usersRouter.put("/:id", validators.passwordValidator.optional({nullable: true}), usersController.updateUser);


module.exports = usersRouter;