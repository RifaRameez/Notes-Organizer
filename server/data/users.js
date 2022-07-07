const bcrypt = require('bcrypt')

const users = [
    {
        email: 'admin@admin.com',
        password: bcrypt.hashSync('123456', 10),
        accountType: 'Admin',
        status: true,
        id: 1
    }
]

module.exports = users