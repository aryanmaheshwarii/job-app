const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const isAuthenticated = require('../middleware/auth');

// router.get('/jobSeeker-getall-applications',isAuthorized, applicationController.jobseekerGetAllApplications);
// router.get('/employer-getall-applications',isAuthorized, applicationController.employerGetAllApplications);
// router.delete('/delete-application/:id', isAuthorized, applicationController.jobseekerDeleteApplication);
// router.post('/jobSeeker-applyJob', isAuthorized, applicationController.postApplication);


router.post("/post", isAuthenticated, applicationController.postApplication);
router.get("/employer/getall", isAuthenticated, applicationController.employerGetAllApplications);
router.get("/jobseeker/getall", isAuthenticated, applicationController.jobseekerGetAllApplications);
router.delete("/delete/:id", isAuthenticated, applicationController.jobseekerDeleteApplication);

module.exports = router;