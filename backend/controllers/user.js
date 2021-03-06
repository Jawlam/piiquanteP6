
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptojs = require('crypto-js');

require('dotenv').config();

const userSchema = require('../validators/user')
const User = require('../models/User');


exports.signup = (req, res, next) => {
  // const password = req.body.password;
  if (!userSchema.isValidSync(req.body)) {
    return res.status(400).json({
      message:
        'L\'email doit etre valide et le MDP doit faire 10 caractère, avec une maj, une min et un chiffre.',
    });
  }
  const cryptedEmail = cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_SECRET).toString();

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: cryptedEmail,
        password: hash, 
      });

      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json(error));
    })
    .catch((error) => res.status(500).json(error));
};


exports.login = (req, res, next) => {
  const cryptedEmail = cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_SECRET).toString();

  User.findOne({ email: cryptedEmail })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé !' });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id, 
            token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
              expiresIn: '24h',
            }),
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json(error)
        });
    })
    .catch((error) => res.status(500).json( error));
};