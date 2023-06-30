const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { REGEXP_URL } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: function (url) {
        return REGEXP_URL.test(url);
      },
      message: function ({ value }) {
        return value + 'неверный URL';
      },
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type:String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        return validator.isEmail(email);
      },
      message: function ({ value }) {
        return `Ошибка! ${value} не является электронной почтой`;
      },      
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
},
{
  toObject: { useProjection: true},
  toJSON: { useProjection: true},
});

userSchema.statics.findUserByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Неправильные почта или пароль');
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new Error('Неправильные почта или пароль');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('user', userSchema);