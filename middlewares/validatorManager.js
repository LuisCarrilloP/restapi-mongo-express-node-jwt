import { body, param, validationResult } from "express-validator"
import axios from 'axios'

export const validationResultExpress = (req, res, next) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()){
    return res.status(400).json({error: errors.array()})
  }

  next()
}

export const registerValidator = [
  body('email', "Invalid email format")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body('password', "Password must contain at least 6 characters")
    .trim()
    .isLength({ min: 6 }),
  body("password", "Invalid password format")
    .custom((value, { req }) => {
      if (value !== req.body.repassword) {
          throw new Error("Both passwords must coincide");
      }
      return value;
    }),
  validationResultExpress
]

export const loginValidator = [
  body('email', "Invalid email format")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body('password', "Invalid password format")
    .trim()
    .isLength({ min: 8 }),
  validationResultExpress,
]

export const paramLinkValidator = [
  param("id", "Formato no válido (express-validator)")
    .trim()
    .notEmpty()
    .escape(),
  validationResultExpress
]

export const bodyLinkValidator = [
  body("longLink", "formato link incorrecto")
    .trim()
    .notEmpty()
    .custom(async value => {
      try {
        if(!value.startsWith('https://')){
          value = "https://" + value
        }
        console.log(value);

        await axios.get(value)
        return value
      } catch (error) {
        console.log(error);
        throw new Error("not found longlink 404")
      }
    })
    ,
  validationResultExpress
]