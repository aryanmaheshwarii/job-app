const jwt = require("jsonwebtoken");
const catchAsyncError = require("./catchAsyncError");
const errorHandler = require("./error");
const User = require("../models/userSchema");

const isAuthenticated = catchAsyncError(async(req, res, next) => {
    // yha m cookie ko get krunga ...
    const {token} = req.cookies; // cookie m se token nikaal lia
    // agar user login nahi hua hoga to uske pass token nhi hoga islie ...
    if(!token){
        return next(new errorHandler("user not authorized", 400))
    }
    // ab token ko decode krvaunga
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // ab user ko dhundinge uski id ke through
    req.user = await User.findById(decode.id); // req.user m puura user store ho chuka hai
    next();
})

module.exports = isAuthenticated;