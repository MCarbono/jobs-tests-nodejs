const config = require('../config')
const jwt = require('jsonwebtoken')

function createJWT(id, name){
    return jwt.sign({ userId: id, name }, config.jsonWebToken.jwtSecret, {
        expiresIn: config.jsonWebToken.jwtExpiresIn
    })
}

module.exports = { createJWT };