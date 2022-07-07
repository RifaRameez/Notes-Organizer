require('dotenv').config()
const userData = require('./data/users')
const { User } = require('./models/userModel')
const connection = require('./config/db')

connection()

const addData = async() => {
    try{
        await User.insertMany(userData)

        console.log('Data Added')
        process.exit()
    } catch(error){
        console.log(error)
        process.exit(1)
    }
}

const destroyData = async() => {
    try{
        await User.deleteMany()

        console.log('Data Destroyed')
        process.exit()
    } catch(error) {
        console.log(error)
        process.exit(1)
    }
}

if(process.argv[2] === '-d') {
    destroyData()
} else{
    addData()
}