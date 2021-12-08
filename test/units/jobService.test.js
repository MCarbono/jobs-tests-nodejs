const { before, beforeEach, afterEach, describe, test } = require('mocha');
const sinon = require('sinon');

const JobService = require('../../src/services/jobService');

const { expect } = require('chai')
const chai = require('chai')
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const {
    NotFoundError,
    BadRequestError
} = require('../../src/errors')

const mocks = {
    createJobSuccessDatabase: require('../mocks/jobs/createJobSuccessDatabase.json'),
    createJobSuccessPayload: require('../mocks/jobs/createJobSuccessPayload.json'),
    createJobErrorPositionPayload: require('../mocks/jobs/createJobErrorPositionPayload.json'),
    createJobErrorCompanyPayload: require('../mocks/jobs/createJobErrorCompanyPayload.json'),
    deleteJobPayload: require('../mocks/jobs/deleteJobPayload.json'),
    deleteJobSuccessPayloadDatabase: require('../mocks/jobs/deleteJobSuccessPayloadDatabase.json'),
    updateJobSuccessDatabase: require('../mocks/jobs/updateJobSuccessDatabase.json'),
    updateJobSuccessPayload: require('../mocks/jobs/updateJobSuccessPayload.json'),
    updateJobErrorPosition: require('../mocks/jobs/updateJobErrorPosition.json'),
    updateJobErrorCompany: require('../mocks/jobs/updateJobErrorCompany.json'),
    updateJobErrorStatus: require('../mocks/jobs/updateJobErrorStatus.json'),
    getJobSuccessDatabase: require('../mocks/jobs/getJobSuccessDatabase.json'),
    getJobSuccessPayload: require('../mocks/jobs/getJobSuccessPayload.json'),
    getJobsSuccessDatabase: require('../mocks/jobs/getJobsSuccessDatabase.json'),
    getJobsSuccessPayload: require('../mocks/jobs/getJobsSuccessPayload.json'),
}

let jobService;
let sandbox;
describe('jobService suite tests', () => {
    before(() => {
        jobService = new JobService()
    })

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe("Create Job", () => {
        test('Should be able to create a Job', async () => {
            const createJobSuccessDatabase = mocks.createJobSuccessDatabase;
            const createJobSuccessPayload = mocks.createJobSuccessPayload;

            sandbox.stub(
                jobService.repository,
                jobService.repository.createJob.name
            ).resolves(createJobSuccessDatabase)

            createJobSpy = sandbox.spy(jobService, jobService.createJob.name);

            const result = await jobService.createJob(createJobSuccessPayload);

            expect(createJobSpy.calledOnce).to.be.ok
            expect(createJobSpy.calledWithExactly(createJobSuccessPayload)).to.be.ok
            expect(result).to.be.deep.equal(createJobSuccessDatabase)
            expect(result.job).to.have.property('company')
            expect(result.job).to.have.property('position')
        })

        test('Should not be able to create a job without a position', async () => {
            const createJobErrorPositionPayload = mocks.createJobErrorPositionPayload;

            expect(
                jobService.createJob(createJobErrorPositionPayload)
            ).to.be.rejectedWith(BadRequestError, 'Company or Position fields cannot be empty')
        })

        test('Should not be able to create a job without a company', async () => {
            const createJobErrorCompanyPayload = mocks.createJobErrorCompanyPayload;

            expect(
                jobService.createJob(createJobErrorCompanyPayload)
            ).to.be.rejectedWith(BadRequestError, 'Company or Position fields cannot be empty')
        })
    })

    describe("Delete Job", () => {
        test('Should be able to delete a job', async () => {
            const deleteJobPayload = mocks.deleteJobPayload;
            const deleteJobSuccessPayloadDatabase = mocks.deleteJobSuccessPayloadDatabase;

            sandbox.stub(
                jobService.repository,
                jobService.repository.deleteJob.name
            ).resolves(deleteJobSuccessPayloadDatabase)

            const deleteSpy = sandbox.spy(jobService, jobService.deleteJob.name)

            const result = await jobService.deleteJob(deleteJobPayload);
            
            expect(deleteSpy.calledOnce).to.be.ok
            expect(deleteSpy.calledWithExactly(deleteJobPayload)).to.be.ok
            expect(result).to.be.deep.equal(deleteJobSuccessPayloadDatabase)
        })

        test('Should not be able to delete a job that does not exists', async () => {
            const deleteJobPayload = mocks.deleteJobPayload;

            sandbox.stub(
                jobService.repository,
                jobService.repository.deleteJob.name
            ).resolves(null)

            expect(jobService.deleteJob(deleteJobPayload)).to.be.rejectedWith(NotFoundError, `No job with id ${deleteJobPayload.jobId}`)
        })
    })

    describe("Update a job", () => {
        test('Should be able to update a job', async () => {
            const updateJobSuccessDatabase = mocks.updateJobSuccessDatabase
            const updateJobSuccessPayload = mocks.updateJobSuccessPayload

            sandbox.stub(
                jobService.repository,
                jobService.repository.updateJob.name
            ).resolves(updateJobSuccessDatabase)

            const updateJobSpy = sandbox.spy(jobService, jobService.updateJob.name)

            const result = await jobService.updateJob(updateJobSuccessPayload)
            
            expect(updateJobSpy.calledOnce).to.be.ok
            expect(updateJobSpy.calledWithExactly(updateJobSuccessPayload)).to.be.ok
            expect(result).to.be.deep.equal(updateJobSuccessDatabase)
        })

        test('Should not be able to update a job that does not exists', async () => {
            const updateJobPayload = mocks.updateJobSuccessPayload

            sandbox.stub(
                jobService.repository,
                jobService.repository.updateJob.name
            ).resolves(null)

            expect(jobService.updateJob(updateJobPayload)).to.be.rejectedWith(NotFoundError, `No job with id ${updateJobPayload.jobId}`)
        })

        test('Should not be able to update position job with an empty position', async () => {
            const updateJobErrorPosition = mocks.updateJobErrorPosition

            expect(jobService.updateJob(updateJobErrorPosition)).to.be.rejectedWith(BadRequestError, 'Company or Position fields cannot be empty')
        })

        test('Should not be able to update company job with an empty company', async () => {
            const updateJobErrorCompany = mocks.updateJobErrorCompany

            expect(jobService.updateJob(updateJobErrorCompany)).to.be.rejectedWith(BadRequestError, 'Company or Position fields cannot be empty')
        })

        test('Should not be able to update status job with an invalid value', async () => {
            const updateJobErrorStatus = mocks.updateJobErrorStatus
            
            expect(jobService.updateJob(updateJobErrorStatus)).to.be.rejectedWith(BadRequestError, 'status has an invalid value')
        })
    })

    describe('Get a job', () => {
        test('Should be able to get a job', async () => {
            const getJobSuccessDatabase = mocks.getJobSuccessDatabase
            const getJobSuccessPayload = mocks.getJobSuccessPayload

            sandbox.stub(
                jobService.repository,
                jobService.repository.findJob.name
            ).resolves(getJobSuccessDatabase)

            const getJobSpy = sandbox.spy(jobService, jobService.getJob.name)

            const result = await jobService.getJob(getJobSuccessPayload);
            
            expect(getJobSpy.calledOnce).to.be.ok
            expect(result).to.be.deep.equal(getJobSuccessDatabase)
        })

        test('Should not be able to get a job that does not exists', async () => {
            const getJobSuccessPayload = mocks.getJobSuccessPayload

            sandbox.stub(
                jobService.repository,
                jobService.repository.findJob.name
            ).resolves(null)

            expect(jobService.getJob(getJobSuccessPayload)).to.be.rejectedWith(NotFoundError, `No job with id ${getJobSuccessPayload.jobId}`)
        })
    })

    describe('Get jobs', () => {
        test('Should be able to get user jobs', async () => {
            const getJobsSuccessDatabase = mocks.getJobsSuccessDatabase;
            const getJobsSuccessPayload = mocks.getJobsSuccessPayload;

            sandbox.stub(
                jobService.repository,
                jobService.repository.findJobs.name
            ).resolves(getJobsSuccessDatabase)

            const result = await jobService.getAllJobs(getJobsSuccessPayload);

            expect(result).to.be.deep.equal(getJobsSuccessDatabase)
        })
    })
})