const express = require('express');
const expressWinston = require('express-winston');
const loggerSettings = require('./logger');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require("helmet");
const nocache = require("nocache");
const rateLimit = require('express-rate-limit');

const sauceRoutes = require('./routes/sauce'); 
const userRoutes = require('./routes/user');


require('dotenv').config();

const passLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 60
});



mongoose
  .connect(process.env.SECRET_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(expressWinston.logger(loggerSettings));
app.use(passLimiter);



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(nocache());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
