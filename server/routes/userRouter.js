const router = require('express').Router()
const userController = require('../controllers/userController')
const { auth, authAdmin} = require('../middleware/auth')

router.route('/')
    .post(userController.login)
    .get(auth, authAdmin, userController.getUsers)
    .put(auth, userController.updateProfile)

router.get('/:type/:param', auth, authAdmin, userController.searchUser)

router.post('/register', auth, authAdmin, userController.register)

router.route('/note')
    .get(auth, userController.getNote)
    .post(auth, userController.addNote)

router.route('/note/:id')
    .put(auth, userController.updateNote)
    .delete(auth, userController.deleteNote)

module.exports = router