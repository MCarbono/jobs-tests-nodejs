const JobService = require('../../services/jobService');

class GetAllJobsController {
    async handle(req,res) {
        const jobService = new JobService()
        const jobs = await jobService.getAllJobs(req.user.userId)
        res.json({ jobs, count: jobs.length })
    }
}

module.exports = GetAllJobsController;