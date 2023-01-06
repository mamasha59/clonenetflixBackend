const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const BadRequestError = require('../Errors/bad-reauesr-err');
const ConflictError = require('../Errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser =  async(req,res, next) => { // controller to make new user
const {email,password} = req.body; // take data
await bcrypt
        .hash(password,10) // add salt
        .then((hash) => User.create({ //make new use by data
            email,
            password:hash
        }))
        .then((user) => { // if OK, send only email
            res.send({
                email:user.email
            })
        })
        .catch((err) => {
            if (err.name === "ValidationError") {
              next(new BadRequestError("Переданы некорректные данные"));
            } else if (err.name === "MongoServerError" && err.code === 11000) {
              next(new ConflictError("Такой пользователь уже существует"));
            } else {
              next(err);
            }
        })

}

module.exports.logIn = async (req, res) => {// controller login
const {email,password} = req.body;
return User.findUserByCredentials(email, password)
        .then((user) => {
            const token = jwt.sign({ _id: user.id }, NODE_ENV === "production" ? JWT_SECRET : "dev-secret",{expiresIn: "7d"});
            res.cookie("jwt", token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: false,
              secure:true
            })
            .send({ data: user });
        })
        .catch(err => res.status(401).send({ message: "Неправильные почта или пароль" }));

  }

  module.exports.getMe = (req, res, next) => { // take all data by token in cookies if its exist
    User.findById(req.user._id)
      .orFail(new Error("NotValidId"))
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        if (err.message === "NotValidId") {
          next(new NotFoundError("Запрашиваемый пользователь не найден"));
        } else {
          next(err);
        }
      });
  };

  module.exports.createProfile = (req, res) => { // router to post new profile in profile array 
    const { name } = req.body;
  // console.log(req.body)

    User.updateOne(
      { _id: req.user._id },
      { $push: { profiles:  {name}  } },
      { new: true, useFindAndModify: false }  
    )
    .then((result) => res.send(result))
    .catch((err) => console.log(err))
  };

module.exports.logout = (req,res) =>{ // to cleat cookies and redirect
    res.clearCookie("jwt")
    .send({message:"Успешно вышли"});
}