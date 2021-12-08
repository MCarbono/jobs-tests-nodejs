const bcrypt = require('bcryptjs');

function comparePassword(typedPassword, userPassword){
    return bcrypt.compare(userPassword, typedPassword);
}

module.exports = { comparePassword };