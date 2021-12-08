const User = require('../models/User')

class UserRepository {
    async create(user){
        return await User.create(user)
    }

    async getUserByEmail(email){
        return await User.findOne({ email })
    }
}

module.exports = UserRepository;