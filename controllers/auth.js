const { firebase } = require('../db/firebase');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const errorHandlerMiddleware = require('../middleware/error-handler');

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
//   const user = userCredential.user;
//   req.session.uid = user.uid;
//   res.status(StatusCodes.OK).json({ id: user.uid, email: user.email });
// };

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    req.session.uid = user.uid;
    // res.status(StatusCodes.OK).json({ id: user.uid, email: user.email });
    // res.status(StatusCodes.OK).json({ message: 'Login success', body: { id: user.uid, email: user.email } });
    res.status(StatusCodes.OK).json({ message: 'Login success', body: user });
  } catch (error) {
    // Check if the error is due to user not found
    if (error.code === 'auth/user-not-found') {
      throw new NotFoundError('User not found');
    } else {
      // For other errors, you might want to log or handle them differently
      throw new BadRequestError('Invalid login credentials');
    }
  }
};

const loginWithGoogle = async (req, res) => {
  const { idToken } = req.body;
  const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
  const userCredential = await firebase.auth().signInWithCredential(credential);
  const user = userCredential.user;
  req.session.uid = user.uid;
  res.status(StatusCodes.OK).json({ message: 'Login success', body: user });
};

const logout = async (req, res) => {
  firebase.auth().signOut()
  .then(() => {
    req.session.destroy();
    res.status(StatusCodes.OK).json({ message: 'Logout success' });
  });
};

const register = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    await user.updateProfile({ displayName: username });
    req.session.uid = user.uid;
    res.status(StatusCodes.CREATED).json({ message: 'User created', body: user });
  } catch (error) {
    throw new BadRequestError('Invalid signup credentials');
  }
};

module.exports = { login, loginWithGoogle, logout, register};