const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const isAuthenticated = require('../middleware/auth');

// router.get('/get-all-jobs', jobController.getAllJobs);
// router.post('/post-jobs', isAuthorized, jobController.postJob);
// router.get('/get-my-jobs', isAuthorized, jobController.getMyJobs);
// router.put('/update-job/:id', isAuthorized, jobController.updateJob);
// router.delete('/delete-job/:id', isAuthorized, jobController.deleteJob);

router.get("/getall",jobController.getAllJobs);
router.post("/post", isAuthenticated, jobController.postJob);
router.get("/getmyjobs", isAuthenticated, jobController.getMyJobs);
router.put("/update/:id", isAuthenticated, jobController.updateJob);
router.delete("/delete/:id", isAuthenticated, jobController.deleteJob);
router.get("/:id", isAuthenticated, jobController.getSingleJob);

module.exports = router;