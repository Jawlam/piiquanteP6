const { object, string, number, date, InferType } = require('yup');

const sauceSchema = object({  
  name: string().min(3).required(),
  manufacturer: string().min(3).required(),
  description: string().min(3).required(),
  mainPepper: string().min(3).required(),
});

module.exports = sauceSchema;
