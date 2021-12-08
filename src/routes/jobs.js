const { Router } = require('express');
const router = Router();

const { 
    CreateJobController,
    DeleteJobController,
    GetAllJobsController,
    GetJobController,
    UpdateJobController
} = require('../controllers/Job')

//router.route('/').post(createJob).get(getAllJobs)

router.post('/', new CreateJobController().handle)
router.get('/', new GetAllJobsController().handle)

router.get('/:id', new GetJobController().handle)
router.patch('/:id', new UpdateJobController().handle)
router.delete('/:id', new DeleteJobController().handle)

module.exports = router;