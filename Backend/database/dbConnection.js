const { default: mongoose } = require("mongoose");

const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connected to db successfully ...')
    })
    .catch((err) => {
        console.log(`db connection error : ${err}`)
    })
}

module.exports = dbConnection;