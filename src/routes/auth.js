const { Router } = require('express');
const router = Router();

const { LoginUserController } = require('../controllers/User/loginUserController');
const { RegisterUserController} = require('../controllers/User/registerUserController');

router.post('/register', new RegisterUserController().handle)
router.post('/login', new LoginUserController().handle)

module.exports = router;