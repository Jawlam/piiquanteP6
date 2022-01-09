const winston = require('winston');
const expressWinston = require('express-winston');

const logger = {
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true, 
  colorize: true,
  ignoreRoute: function (req, res) { return false; }
};

module.exports = logger;
