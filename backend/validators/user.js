const { object, string, number, date, InferType } = require('yup');
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(10) // Longueur minimun : 10
  .is()
  .max(64) // Longueur maximum : 64
  .has()
  .uppercase() // Doit avoir au moins une majuscule
  .has()
  .lowercase() // Doit avoir au moins une minuscule
  .has()
  .digits() // Doit avoir au moins un chiffre
  .has()
  .not()
  .spaces(); // Ne doit pas avoir d'espaces

const userSchema = object({  
  email: string().email().required(),
  password: string().test('is-password', value => passwordSchema.validate(value)).required(),
  
});

module.exports = userSchema;
