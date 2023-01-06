const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require("validator");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    minlength: 4,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
},
  password:{
    type: String,
    required: true,
    minlength: 5,
    select: false,
  },
  profiles:[ // array of user's profile
    {
      name:String,
    }
  ],

})

userSchema.statics.findUserByCredentials = function (email, password) { // mongoose metod statics
  return this.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Неправильные почта или пароль"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Неправильные почта или пароль"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('User', userSchema);