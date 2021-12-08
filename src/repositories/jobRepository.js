const Job = require('../models/Job');

class JobRepository {
    async findJobs(id){
        return await Job.find({ createdBy: id }).sort('createdAt')
    }

    async findJob(jobId, userId){
        return await Job.findOne({
            _id: jobId,
            createdBy: userId
        })
    }

    async createJob(job){
        return await Job.create(job);
    }

    async updateJob(jobId, userId, body){
        const { status, company, position } = body;
        return await Job.findByIdAndUpdate(
            { _id: jobId, createdBy: userId },
            { status, company, position },
            { new: true, runValidators: true }
        )
    }

    async deleteJob(jobId, userId){
        return await Job.findOneAndRemove({
            _id: jobId,
            createdBy: userId
        })
    }
}

module.exports = JobRepository;