const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "please provide your name!"],
        minLength: [3, "name must contain atleast 3 characters!"],
        maxLength: [30, "name cannot exceeded 30 characters!"]
    },
    email: {
        type: String,
        require: [true, "please provide your email!"],
        validate: [validator.isEmail, "please provide valid email"] // agar email shi nhi hui to ye error dega...
    },
    phone: {
        type: Number,
        required: [true, "please provide your number!"]
    },
    password: {
        type: String,
        require: [true, "please provide your password!"],
        minLength: [8, "password must contain atleast 8 characters!"],
        maxLength: [32, "password cannot exceeded 32 characters!"],
        select: false
    },
    role: {
        type: String,
        required: [true, "please provide your role"],
        enum: ["Job Seeker", "Employer"] // iske ilava or koi value nhi ho skti.
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// hashing password ... --> userSchema save hone se pehle ye cheez run hogi.
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) // agar user ne password modify nhi kra to next ko bhejdo..
        next();
    this.password = await bcrypt.hash(this.password, 10);
});

// comparing password ...
userSchema.methods.comparePass = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
};

// generating jwt web token --> for authorization ...
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRE
    })
}

const User = mongoose.model('User', userSchema);
module.exports = User;