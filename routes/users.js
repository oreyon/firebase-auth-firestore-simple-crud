const express = require('express');
const router = express.Router();

const { getAllUsers, createUser, getUser, deleteUser, updateUser } = require('../controllers/users');

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

module.exports = router;