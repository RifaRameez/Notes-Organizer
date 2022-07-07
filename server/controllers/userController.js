const { User, generateAuthToken, Note } = require('../models/userModel')
const sendEmail = require('../utils/sendEmail')
const bcrypt = require('bcrypt')

const userController = {
    register: async(req, res) => {
        try{  
            const userId = await User.findOne({id: req.body.id})
            if(userId) return res.status(409).send({message: 'User with given id already Exist!'})

            const userEmail = await User.findOne({email: req.body.email})
            if(userEmail) return res.status(409).send({message: 'User with given email already Exist!'})
            
            const salt = await bcrypt.genSalt(Number(process.env.SALT))
            const hashPassword = await bcrypt.hash(req.body.password, salt)
            
            const newUser = await new User({
                id: req.body.id,
                email: req.body.email,
                password: hashPassword,
                accountType: 'Student'
            }).save()

            const url = `login - ${process.env.BASE_URL}/login \npassword = ${req.body.password}`
            await sendEmail(newUser.email, 'Verify Email', url)
    
            res.status(201).send({data: newUser, message: 'An Email sent to your account please verify'})
        } catch(error) {
            res.status(500).send({message: 'Internal Server Error'})
        }
    },
    login: async(req, res) => {
        try{   
            const user = await User.findOne({email: req.body.email})
            if(!user) return res.status(401).send({message: 'Invalid Email or Password'})
    
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if(!validPassword) return res.status(401).send({message: 'Invalid Email or Password'})
    
            const token = generateAuthToken(user._id)
            res.status(200).send({data: {token, user}, message: 'logged in successfully'})
        } catch(error) {
            res.status(500).send({message: 'Internal Server Error'})
        }
    },
    updateProfile: async(req, res) => {
        try{
            const user = await User.findOne({id: req.user.id})
            if(!user) return res.status(401).send({message: 'User does not exists'})
            
            const salt = await bcrypt.genSalt(Number(process.env.SALT))
            const hashPassword = await bcrypt.hash(req.body.password, salt)

            user.firstName = req.body.firstName
            user.lastName = req.body.lastName
            user.dateOfBirth = req.body.dateOfBirth
            user.mobile = req.body.mobile
            user.password = hashPassword
            user.status = true

            await user.save()

            res.status(200).send({data: user, message: 'Updated Successfully'})
        } catch(error) {
            res.status(500).send({message: 'Internal Server Error'})
        }
    },
    getUsers: async(req, res) => {
        try{
            const users = await User.find({accountType: {$ne: 'Admin'}, status: true})

            res.status(200).send({data: users})
        } catch(error) {
            res.status(500).send({message: 'Internal Server Error'})
        }
    },
    getNote: async(req, res) => {
        try{
            const user = await User.findOne({id: req.user.id})
            if(!user) return res.status(401).send({message: 'User does not exists'})

            res.status(200).send({data: user.notes, message: 'Added Successfully'})
        } catch(error) {
            res.status(500).send({message: 'Internal Server Error'})
        }
    },
    addNote: async(req, res) => {
        try{
            const user = await User.findOne({id: req.user.id})
            if(!user) return res.status(401).send({message: 'User does not exists'})

            const newNote = new Note({
                title: req.body.title,
                description: req.body.description
            })

            user.notes.push(newNote)

            await user.save()

            res.status(201).send({data: newNote, message: 'Added Successfully'})
        } catch(error) {
            res.status(500).send({message: 'Internal Server Error'})
        }
    },
    updateNote: async(req, res) => {
        try{
            const user = await User.findOne({id: req.user.id})
            if(!user) return res.status(401).send({message: 'User does not exists'})

            const index = user.notes.findIndex(note => note._id === req.params._id)
            const note = user.notes.splice(index, 1)[0]
            if(!note) return res.status(401).send({message: 'Note does not exists'})
            
            note.title = req.body.title
            note.description = req.body.description

            user.notes.splice(index, 0, note)
            
            await user.save()

            res.status(200).send({data: note, message: 'Updated Successfully'})
        } catch(error) {
            res.status(500).send({message: 'Internal Server Error'})
        }
    }, 
    deleteNote: async(req, res) => {
        try{
            const user = await User.findOne({id: req.user.id})
            if(!user) return res.status(401).send({message: 'User does not exists'})

            const note = user.notes.splice(user.notes.findIndex(note => note._id === req.params._id), 1)[0]
            if(!note) return res.status(401).send({message: 'Note does not exists'})

            await user.save()

            res.status(200).send({message: 'Removed Successfully'})
        } catch(error) {
            res.status(500).send({message: 'Internal Server Error'})
        }
    },
    searchUser: async(req, res) => {
        try{
            if(req.params.type === 'name') {
                const user = await User.find({
                    $or: [{firstName: new RegExp('.*'+req.params.param+'.*')}, {lastName: new RegExp('.*'+req.params.param+'.*')}]
                })
                if(!user) return res.status(401).send({message: 'User does not exists'})

                res.status(200).send({data: user})
            } else if(req.params.type === 'email') {
                const user = await User.find({email: req.params.param})
                if(!user) return res.status(401).send({message: 'User does not exists'})

                res.status(200).send({data: user})
            } else if(req.params.type === 'id') {
                const user = await User.find({id: req.params.param})
                if(!user) return res.status(401).send({message: 'User does not exists'})

                res.status(200).send({data: user})
            } else {
                return res.status(400).send({message: 'Type not found'})
            }
        } catch(error) {
            res.status(500).send({message: 'Internal Server Error'})
        }
    }
}

module.exports = userController