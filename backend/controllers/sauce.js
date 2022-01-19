
const fs = require('fs');
const Sauce = require('../models/sauce');
const sauceSchema = require('../validators/sauce');

const trims = (obj) => {
  Object.keys(obj).map((key, index) => {
    const value = obj[key];
    if(typeof value === 'string') {
      obj[key] = obj[key].trim();
    }
  })
}

const checkInput = (input) => {
  const sauce = (typeof input === 'string') ? JSON.parse(input) : input;
  trims(sauce);
  if (sauceSchema.isValidSync(sauce, { strict: false })) {
    return sauce;
  }else{
    return null;
  }
};

exports.createSauce = (req, res, next) => {
  const input = req.body.sauce
  const sauceObject = checkInput(input);
  if (sauceObject === null) {
    return res.status(400).json(new Error('Tous les champs doivent faire au moins 3 caractères'));
  } 
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
    sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch((error) => res.status(400).json({ error }));
};


exports.modifySauce = (req, res, next) => {
  const input = req.body.sauce || req.body
  const sauceObject = checkInput(input);
  if (sauceObject === null) {
    return res.status(400).json(new Error('Tous les champs doivent faire au moins 3 caractères'));
  } 
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.userId) {
        res.status(403).json({
          message: 'Action non autorisée',
        });
        return;
      }
      let sauceObject2 = sauceObject;
      if (req.file) {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          console.log('Ancienne image supprimer');
        });
        sauceObject2 = {
          ...sauceObject,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
          }`,
        }
      } 
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject2, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ message: 'Souce non trouvée' }));
};


exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.userId) {
        res.status(403).json({
          message: 'Action non autorisée',
        });
        return;
      }
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};


exports.getOneSauce = (req, res, next) => { 
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};


exports.getAllSauces = (req, res, next) => { 
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};


exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like; 
  let userId = req.body.userId;  
  let sauceId = req.params.id; 
  Sauce.findOne({ _id: sauceId }).then((sauce) => {
    switch (like) {
      case 1:
        if (sauce.usersLiked.includes(req.userId)) {
          res.status(400).json({ message: 'Impossible de faire cette action' });
          return;
        }
        Sauce.updateOne(
          { _id: sauceId },
          { $push: { usersLiked: userId }, $inc: { likes: +1 } }
        )
          .then(() => res.status(200).json({ message: `J'aime` }))
          .catch((error) => res.status(400).json({ error }));
        break;

      case 0:
        if (sauce.usersLiked.includes(req.userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } } 
          )
            .then(() => res.status(200).json({ message: `Neutre` }))
            .catch((error) => res.status(400).json({ error }));
        }
        if (sauce.usersDisliked.includes(req.userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
          )
            .then(() => res.status(200).json({ message: `Neutre` }))
            .catch((error) => res.status(400).json({ error }));
        }
        break;

      case -1:
        if (sauce.usersDisliked.includes(req.userId)) {
          res.status(400).json({ message: 'Impossible de faire cette action' });
          return;
        }
        Sauce.updateOne(
          { _id: sauceId },
          { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
        )
          .then(() => {
            res.status(200).json({ message: `Je n'aime pas` });
          })
          .catch((error) => res.status(400).json({ error }));
        break;

      default:
        console.log(error);
    }
  });
};