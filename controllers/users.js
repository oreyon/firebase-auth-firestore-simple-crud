const { usersRef } = require('../db/firebase');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllUsers = async (req, res) => {
  const snapshot = await usersRef.get();
  const users = [];
  snapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data()});
  });
  res.status(StatusCodes.OK).json({ users });
};

const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  const userdoc = usersRef.doc();
  
  const user = {
    idUser  : userdoc.id,
    username: String(username),
    email: String(email),
    password: String(password),
  };
  await userdoc.set(user);
  res.status(StatusCodes.CREATED).json({ user });
}

const getUser = async (req, res) => {
  const userId = req.params.id;
  const userdoc = usersRef.doc(userId);
  const user = await userdoc.get();
  if (!user.exists) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    return;
  }

  const userData = user.data();
  res.status(StatusCodes.OK).json({ id:user.id,  ...userData });
}

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const userdoc = usersRef.doc(userId);
  const user = await userdoc.get();
  if (!user.exists) {
    throw new NotFoundError('User not found');
  }
  await userdoc.delete();
  res.status(StatusCodes.OK).json({ message: 'User deleted' });
}

const updateUser = async (req, res) => {
  const userId = req.params.id;
  let { username, email, password } = req.body;
  const userdoc = usersRef.doc(userId);
  const user = await userdoc.get();
  const userData =  user.data();

  if (!user.exists) {
    throw new NotFoundError('User not found');
  }


  if (username == null || email == null || password === null) {
    throw new BadRequestError('Please fill all the fields');
  } 

 
  if (username === undefined 
    || email === undefined 
    || password === undefined
    || username === ''
    || email === ''
    || password === '') {
    username = String(user.data().username);
    email = String(user.data().email);
    password = String(user.data().password);
  }

  const data  = {
    username: String(username),
    email: String(email),
    password: String(password),
  };
  

  try {
    userdoc.update(data);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    return;
  }

  res.status(StatusCodes.OK).json({ id:user.id, message: { ...data } }); 
}

module.exports = { 
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
};