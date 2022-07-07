const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const noteSchema = new mongoose.Schema({
	title:{
		type: String,
		required: true
	}, 
	description:{
		type: String,
		required: true
	}
}, {
	timestamps: true
})

const userSchema = new mongoose.Schema({
	id:{
		type: Number,
		unique: true,
		required: true
	},
    email:{
		type: String, 
		required: true,
		unique: true
	},
	password:{ 
		type: String, 
		required: true 
	},
	status:{ 
		type: Boolean, 
		default: false 
	},
	firstName:{
		type: String,
		required: false
	},
	lastName:{
		type: String,
		required: false
	},
	dateOfBirth:{
		type: Date,
		required: false
	},
	mobile:{
		type: Number,
		required: false
	},
	accountType:{
		type: String,
		required: true
	},
	notes: [noteSchema]
}, {
	timestamps: true
})

const generateAuthToken = (id) => {
    const token = jwt.sign({id}, process.env.JWTPRIVATEKEY, {expiresIn: '1d'})
    return token
}

const User = mongoose.model('user', userSchema)
const Note = mongoose.model('note', noteSchema)

const validate = (data) => {
	const schema = Joi.object({
		userName: Joi.string().required().label('User Name'),
		email: Joi.string().email().required().label('Email'),
		password: passwordComplexity().required().label('Password')
	});
	return schema.validate(data)
};

module.exports = { User, validate, generateAuthToken, Note }