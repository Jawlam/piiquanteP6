const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: mongoose.ObjectId, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: [mongoose.ObjectId], required: true },
  usersDisliked: { type: [mongoose.ObjectId], required: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);