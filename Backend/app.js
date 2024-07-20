const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const cloudinary = require('cloudinary').v2 // is used to upload images...
const cors = require('cors'); // to connect frontend with backend
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload'); // for uploading files --> simpler than multer.
const dbConnection = require('./database/dbConnection');
const errorMiddleware = require('./middleware/error');

// middlewares ...
app.use(cookieParser()); // for authentication --> to read the cookie.
app.use(express.json()); // parsing the json data
app.use(express.urlencoded({ extended: true })); // to read the data from body using post request --> convert string to json format.

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // methods to use in your application.
    credentials: true
}))

app.use(fileUpload({ // through documentation...
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.get('/', (req, res) => {
    res.send('hey');
})

// routes ...
app.use('/user', require('./routes/userRouter'));
app.use('/application', require('./routes/applicationRouter'));
app.use('/job', require('./routes/jobRouter'));

dbConnection();
app.use(errorMiddleware.errorMiddleware);

app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`)
})