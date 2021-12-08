require('dotenv').config();

const config  = {
    database: {
        uri: process.env.MONGO_URI
    },
    server: {
        port: process.env.PORT
    },
    jsonWebToken: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN
    }
}

module.exports = config;