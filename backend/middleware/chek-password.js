const passwordSchema = require('../models/password');

// vérifie que le mot de passe valide le schema décrit
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.status(400).json({
      message:
        'Le MDP doit faire 10 caractère au moins, avec une maj, une min et un chiffre au moins.',
    });
  } else {
    next();
  }
};