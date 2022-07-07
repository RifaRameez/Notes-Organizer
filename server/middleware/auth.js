const jwt = require('jsonwebtoken')
const { User } = require('../models/userModel')

const auth = async(req, res, next) => {
    try{
        if(
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            try{
                const token = req.headers.authorization.split(' ')[1]
                const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)

                req.user = await User.findById(decoded.id).select('-password')

                next()
            } catch(error) {
                return res.status(401).send('Not authorized, token failed')
            }
        } else {
            return res.status(401).send('Not authorized, no token')
        }
    } catch(error) {
        return res.status(500).send({message: "Internal Server Error"})
    }
}

const authAdmin = async(req, res, next) => {
    try{
        if(req.user.accountType !== 'Admin') return res.status(400).send({message: 'Admin access denied'})

        next()
    } catch(error){
        res.status(500).send({message: 'Internal Server Error'})
    }
}

module.exports = { auth, authAdmin }