const UserRepository = require("../repositories/userRepository");
const { BadRequestError, UnauthenticatedError } = require('../errors')
const { createJWT }= require('../utils/createJWT');
const { comparePassword }= require('../utils/comparePassword');

class UserService {
    constructor(){
        this.repository = new UserRepository();
    }

    async register({ name, email, password }) {
        if(!name || !email || !password) throw new BadRequestError('Please provide name, email and password');
        
        const user = await this.repository.create({ name, email, password });
        const token = createJWT(user._id, user.name);
        return { user, token }
    }

    async login({ email, password }) {
        if(!email || !password) throw new BadRequestError('Please provide email and password')

        const user = await this.repository.getUserByEmail(email)
        if(!user) throw new UnauthenticatedError('Invalid Credentials')
        
        const isPasswordCorrect = await comparePassword(user.password, password)
        if(!isPasswordCorrect) throw new UnauthenticatedError('Invalid Credentials')

        const token = createJWT(user.id, user.name);
        return { user: {name: user.name}, token }
    }
}

module.exports = UserService;