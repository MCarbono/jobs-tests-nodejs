const JobService = require('../../services/jobService');
const { StatusCodes } = require('http-status-codes');

class UpdateJobController {
    async handle(req,res) {
        const {
            //body: { company, position },
            body,
            user: { userId },
            params: { id: jobId }
        } = req;

        const jobService = new JobService();
        const job = await jobService.updateJob({ body, userId, jobId })

        res.json({ job })
    }
}

module.exports = UpdateJobController;