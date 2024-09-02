const express =  require('express')
const registerUser = require('../controller/registerUser')
const checkEmail = require('../controller/checkEmail')
const checkPassword = require('../controller/checkPassword')
const userDetails = require('../controller/userDetail')
const logout = require('../controller/logout')
const updateUserDetails = require('../controller/updateUserDetails')
const loginUser = require('../controller/loginUser');
const searchUser = require('../controller/searchuser')

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        console.log("Register route hit");
        await registerUser(req, res);
    } catch (error) {
        console.error('Error in /register route:', error);
        res.status(500).json({ message: 'Internal Server Error', error: true });
    }
});


router.post('/email', checkEmail)

router.post('/password', checkPassword)

router.get('/user-details', userDetails)

router.get('/logout', logout)

router.post('/update-user', updateUserDetails)

router.post('/login', loginUser);

router.post('/search-user, searchUser')

module.exports =  router