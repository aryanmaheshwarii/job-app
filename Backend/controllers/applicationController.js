const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../middleware/error");
const Application = require("../models/applicationSchema");
const Job = require("../models/jobSchema");
const cloudinary = require('cloudinary').v2;
const errorHandler = ErrorHandler.ErrorHandler;

// Employer --> jo bhi job ke lie appliaction aayi h use dekhega yha pr...
const employerGetAllApplications = catchAsyncError(
    async (req, res, next) => {
        const { role } = req.user;
        if (role === "Job Seeker") {
            return next(
                new errorHandler("Job Seeker not allowed to access this resource.", 400)
            );
        }
        const { _id } = req.user;
        const applications = await Application.find({ "employerID.user": _id });
        res.status(200).json({
            success: true,
            applications,
        });
    }
);

// har job seeker apni apni application dekh skta hai jisme usne apply kra h --> jha jha usne apply kra hai.
const jobseekerGetAllApplications = catchAsyncError(
    async (req, res, next) => {
        const { role } = req.user;
        if (role === "Employer") {
            return next(
                new errorHandler("Employer not allowed to access this resource.", 400)
            );
        }
        const { _id } = req.user;
        const applications = await Application.find({ "applicantID.user": _id });
        res.status(200).json({
            success: true,
            applications,
        });
    }
);

// job seeker hi application ko delete kr skta hai, employer nahi kr skta ...
const jobseekerDeleteApplication = catchAsyncError(
    async (req, res, next) => {
        const { role } = req.user;
        if (role === "Employer") {
            return next(
                new errorHandler("Employer not allowed to access this resource.", 400)
            );
        }
        const { id } = req.params;
        const application = await Application.findById(id);
        if (!application) {
            return next(new errorHandler("Application not found!", 404));
        }
        await application.deleteOne();
        res.status(200).json({
            success: true,
            message: "Application Deleted!",
        });
    }
);

// job seeker apni application post kr rha hai --> job ke lie apply kr rha h
const postApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
        return next(
            new errorHandler("Employer not allowed to access this resource.", 400)
        );
    }
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new errorHandler("Resume File Required!", 400));
    }

    const { resume } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
    if (!allowedFormats.includes(resume.mimetype)) { // agar resume uppar wale formats m nahi hai to.
        return next(
            new errorHandler("Invalid file type. Please upload a PNG file.", 400)
        );
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error || "Unknown Cloudinary error"
        );
        return next(new errorHandler("Failed to upload Resume to Cloudinary", 500));
    }
    const { name, email, coverLetter, phone, address, jobId } = req.body;
    const applicantID = {
        user: req.user._id,
        role: "Job Seeker",
    };
    if (!jobId) {
        return next(new errorHandler("Job not found!", 404));
    }
    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        return next(new errorHandler("Job not found!", 404));
    }

    const employerID = {
        user: jobDetails.postedBy,
        role: "Employer",
    };
    if (!name || !email || !coverLetter || !phone || !address || !applicantID || !employerID || !resume) {
        return next(new errorHandler("Please fill all fields.", 400));
    }
    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        applicantID,
        employerID,
        resume: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: "Application Submitted!",
        application,
    });
});

module.exports = { employerGetAllApplications, jobseekerGetAllApplications, jobseekerDeleteApplication, postApplication };