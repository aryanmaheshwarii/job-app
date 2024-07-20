const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../middleware/error");
const Job = require("../models/jobSchema");
const errorHandler = ErrorHandler.ErrorHandler;

// all the jobs available...
const getAllJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ expired: false }) // jobs nikaal lunga jo bhi jobs expire nahi hui 
  res.status(200).json({
    success: true,
    jobs
  })
})

// posting a new job...
const postJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new errorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { title, description, category, country, city, location, fixedSalary, salaryFrom, salaryTo } = req.body;

  if (!title || !description || !category || !country || !city || !location) {
    return next(new errorHandler("Please provide full job details.", 400));
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new errorHandler(
        "Please either provide fixed salary or ranged salary.",
        400
      )
    );
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new errorHandler("Cannot Enter Fixed and Ranged Salary together.", 400)
    );
  }
  const postedBy = req.user._id;
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });
  res.status(200).json({
    success: true,
    message: "Job Posted Successfully!",
    job,
  });
});

// jo job mene post kri hai m apni vo job dekh paunga and jo kisi or ne kri h vo wali vo dekh payega.
const getMyJobs = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  // console.log('req.user', req.user);
  // console.log('myJob', role);
  if (role === "Job Seeker") {
    return next(
      new errorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myJobs,
  });
});

// update job
const updateJob = catchAsyncError(async (req, res, next) => {
  // console.log(req.user);
  const { role } = req.user;
  // console.log('update', role);
  if (role === "Job Seeker") {
    return next(
      new errorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new errorHandler("OOPS! Job not found.", 404));
  }
  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Job Updated!",
  });
});

// Deleting a job ...
const deleteJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new errorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new errorHandler("OOPS! Job not found.", 404));
  }
  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job Deleted!",
  });
});

// getting single job ...
const getSingleJob = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return next(new errorHandler("Job not found.", 404));
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new errorHandler(`Invalid ID / CastError`, 404));
  }
});

module.exports = { getAllJobs, postJob, getMyJobs, updateJob, deleteJob, getSingleJob }