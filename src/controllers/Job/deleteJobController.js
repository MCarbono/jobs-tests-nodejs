const JobService = require('../../services/jobService');
const { StatusCodes } = require('http-status-codes');

class DeleteJobController {
    async handle(req,res) {
        const {
            user: { userId },
            params: { id: jobId }
        } = req;

        const jobService = new JobService();

        await jobService.deleteJob({jobId, userId})

        res.status(StatusCodes.NO_CONTENT).send()
    }
}

module.exports = DeleteJobController;