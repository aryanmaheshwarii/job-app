module.exports = sendToken = (user, statuscode, res, message) => {
    const Token = user.getJWTToken();
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }
    res.status(statuscode).cookie("token", Token, options).json({
        success: true,
        user,
        message, 
        Token
    })
};

// module.exports = sendToken;