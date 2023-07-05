const asyncHandler = require("express-async-handler");
const res = require("express/lib/response");
const User = require("../models/userModel");
const { generateToken } = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
    const { name, mobile, password, pic } = req.body;

    if (!name || !mobile || !password) {
        res.status(400);
        throw new Error("Please enter all fields");
    }

    const userExits = await User.findOne({ mobile });

    if (userExits) {
        res.status(400);
        throw new Error("You have already an account. Please try to login!");
    }

    const user = await User.create({
        name,
        mobile,
        password,
        pic,
    });

    if (user) {
        const token = generateToken(user._id);
        user.tokens.push({ token }); // Save the token to the user's tokens array
        await user.save();

        res.status(200).json({
            status: 200,
            message: "You have been successfully create new account",
            data: {
                _id: user._id,
                name: user.name,
                email: user.mobile,
                pic: user.pic,
                access_token: token
            }

        });
    } else {
        res.status(400);
        throw new Error("Failed to create new user");
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });

    if (user && user.matchPassword(password)) {

        const token = generateToken(user._id);
        user.tokens.push({ token }); // Save the token to the user's tokens array
        await user.save();

        res.status(200).json({
            status: 200,
            message: "Login successfully.",
            data: {
                _id: user._id,
                name: user.name,
                mobile: user.mobile,
                pic: user.pic,
                access_token: token,
            }
        });
    } else {
        res.status(400);
        throw new Error("Mobile or Password do not match!");
    }
})


const logout = asyncHandler(async (req, res) => {
    const user = req.user; // Assuming the authenticated user is available in req.user
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is provided in the "Authorization" header as a bearer token
    // Remove the token from the user's tokens array
    const getUser = await User.findOne({ _id: user.id });
    getUser.tokens = getUser.tokens.filter((tokenObj) => tokenObj.token !== token);

    await getUser.save();
    res.status(200).json({
        status: 200,
        message: "Logout successful.",
    });
});

module.exports = { registerUser, authUser, logout }