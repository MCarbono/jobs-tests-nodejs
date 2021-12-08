const UserService = require('../../services/userService')
const { StatusCodes } = require('http-status-codes')

class RegisterUserController {
    async handle(req,res){
        const userService = new UserService();
        const registerUser = await userService.register(req.body);

        const { user, token } = registerUser;
        return res.status(StatusCodes.CREATED).json({ name: user.name, token});
    }
}   

module.exports = { RegisterUserController };