require('dotenv').config();
require('express-async-errors');
const path = require('path');
const express = require('express');
const session = require('express-session');
const app = express();


const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// connect to db
// const { admin, firebase, usersRef, db } = require('./db/firebase');
const { db } = require('./db/firebase');

// routers
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

// error handler
const isAuthenticated = require('./middleware/isAuthenticated');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra pachages
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowsMs: 15 * 60 * 1000, //15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
})
);

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', isAuthenticated, usersRouter);

// error handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
 try {
  await db;
  app.listen(port, () => 
   console.log(`Server running on port ${port}`)
  );
 } catch (error) {
  console.log(error);
 }
};


start();