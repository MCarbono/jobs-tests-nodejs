const UserService = require('../../services/userService')

class LoginUserController {
    async handle(req, res){
        const userService = new UserService();

        const user = await userService.login(req.body)
        return res.json({ user })
    }
}

module.exports = { LoginUserController }