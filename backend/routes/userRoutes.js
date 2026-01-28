const express = require('express');
const router = express.Router();

const {createUser,getAllUsers,getSingleUser,updateUser,deleteUser} = require('../controllers/userController');

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getSingleUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
module.exports = router;
