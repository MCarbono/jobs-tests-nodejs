const JobRepository = require('../repositories/jobRepository');

const { 
    NotFoundError, 
    BadRequestError 
} = require('../errors')

class JobService {
    constructor() {
        this.repository = new JobRepository();
    }

    async getAllJobs({userId}) {
        const jobs = await this.repository.findJobs(userId)
        return jobs;
    }

    async getJob({ jobId, userId }) {
        const job = await this.repository.findJob(jobId, userId)
        if (!job) throw new NotFoundError(`No job with id ${jobId}`)
        return job;
    }

    async createJob({ company, position, status, userId }) {
        if (company === '' || position === '')
            throw new BadRequestError('Company or Position fields cannot be empty')

        const job = await this.repository.createJob({
            company,
            position,
            status,
            createdBy: userId
        })
        return job;
    }

    async updateJob({ body, userId, jobId }) {
        const { company, position, status } = body;

        if (company === '' || position === '')
            throw new BadRequestError('Company or Position fields cannot be empty')

        if(!status.match(/interview|declined|pending/))
            throw new BadRequestError('status has an invalid value')
        
        const job = await this.repository.updateJob(jobId, userId, body)
        
        if (!job) throw new NotFoundError(`No job with id ${jobId}`)

        return job;
    }

    async deleteJob({ jobId, userId }) {
        const job = await this.repository.deleteJob(jobId, userId)
        if (!job) throw new NotFoundError(`No job with id ${jobId}`)
        return job
    }
}

module.exports = JobService;