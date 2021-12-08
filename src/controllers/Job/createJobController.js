const JobService = require('../../services/jobService');
const { StatusCodes } = require('http-status-codes');

class CreateJobController {
    async handle(req,res) {
        req.body.createdBy = req.user.userId;

        const jobService = new JobService();
        const job = await jobService.createJob(req.body);

        res.status(StatusCodes.CREATED).json({ job });
    }
}

module.exports = CreateJobController;