const express = require("express");
const { registerUser, authUser, logout } = require("../controllers/userController");
const { authenticateToken } = require("../middleware/errorMiddleware");
const AuthRouter = express.Router();

AuthRouter.route('/').post(registerUser)
AuthRouter.post('/login', authUser);
AuthRouter.post("/logout", authenticateToken, logout);
module.exports = AuthRouter;