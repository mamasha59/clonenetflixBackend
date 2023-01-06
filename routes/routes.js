const router = require("express").Router();

const {createUser, logIn, getMe, logout, createProfile} = require('../controllers/user');

const auth = require("../middlewares/auth");
const {validationCreateUser, validationLogIn} = require('../middlewares/celebrateValidation');

const notFound = require("../Errors/notFound")

router.post('/signup', validationCreateUser, createUser); // route of registration/sign up

router.post('/signin', validationLogIn, logIn); // route of signin

router.get("/signout", logout);// route log out - deleting cookies so that user log out

router.use(auth); // below all ports wich is need authentication

router.use('/me', getMe); // route to login info of user while refreshing page/ take data from cookies

router.post('/createProfile', createProfile);

router.use("*", () => {
    throw new notFound("Запрашиваемый ресурс не найден");
  });

module.exports = router;
