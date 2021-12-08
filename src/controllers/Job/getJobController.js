const JobService = require('../../services/jobService');
const { StatusCodes } = require('http-status-codes');

class GetJobController {
    async handle(req,res) {
        const { user: { userId }, params: { id: jobId } } = req;
        const job = await new JobService().getJob(jobId, userId)
        res.json({ job })
    }
}

module.exports = GetJobController;