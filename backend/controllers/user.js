const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const User = require('../models/user');

const validEmail = (email) => {
  let emailRegexp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return emailRegexp.test(email);
};

exports.signup = (req, res, next) => {
  if(validEmail(req.body.email) && req.body.password) {
    bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json(error));
    })
  } else {
    res.status(400).json({ message: 'mail ou mots de passe non valide' });
  }
};

exports.login = (req, res, next) => {
  if(validEmail(req.body.email) && req.body.password) {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(401).json(new Error("l'utilisateur n'existe pas"));
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
                expiresIn: '24h',
              }),
            });
          }).catch((error) => {
            console.log(error);
            res.status(500).json(error)
          });
    })
    .catch((error) => res.status(500).json( error));
  } else {
    res.status(400).json({ message: 'mail ou mots de passe non valide' });
  }
};
