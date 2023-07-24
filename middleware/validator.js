import { body, validationResult } from "express-validator";
import fs from 'fs'

const validator = {
    registerValidation : async(req, res, next) => {
      try {
        await body('username').notEmpty().run(req);
        await body('email').notEmpty().isEmail().run(req);
        await body('phoneNumber').notEmpty().isLength({max:13, min:11}).withMessage('Phone Number Length must 11 or 13, if still wrong Number, you can buy new Phone Number again').run(req);
        await body('password').notEmpty().isStrongPassword({
          minLength: 6,
          minSymbols : 1,
          minNumbers : 1,
          minUppercase: 1,
          minLowercase: 1
        }).run(req);
        const validation = validationResult(req);
        
        if (validation.isEmpty()) {
          next();
        }else{
            res.status(400).send({
            status : false,
            message : 'Validation failed because validation failed because validation failed',
            error : validation.array()
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    changePassword: async (req, res, next) => {
      try {
        await body('oldPassword').trim().notEmpty().run(req);
        await body('newPassword').trim().notEmpty().run(req);
        await body('confirmPassword').trim().notEmpty().equals(req.body.newPassword).withMessage("Password didn't match, try to idem with New Password").run(req);
        const validation = validationResult(req);
        
        if (validation.isEmpty()) {
          next();
        }else{
            res.status(400).send({
            status : false,
            message : 'This validation failed because validation failed because validation failed',
            error : validation.array()
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    
    changeUsername : async (req, res, next) =>{
      await body('Username').trim().notEmpty().run(req);
      await body('newUsername').trim().notEmpty().run(req);
      const validation = validationResult(req);
        
      if (validation.isEmpty()) {
        next();
      }else{
          res.status(400).send({
          status : false,
          message : 'Validation failed because validation failed because validation failed',
          error : validation.array()
        });
      }
    },
    changePhoneNumber : async (req, res, next) =>{
      await body('phone').trim().notEmpty().isNumeric().isLength({min:11, max:14}).run(req);
      await body('newPhone').trim().notEmpty().isLength({min:11, max:14}).withMessage('Number Phone is Around : 12, max : 14').run(req);
      const validation = validationResult(req);
        
      if (validation.isEmpty()) {
        next();
      }else{
          res.status(400).send({
          status : false,
          message : 'Validation failed because validation failed because validation failed',
          error : validation.array()
        });
      }
    },
    changeEmail: async (req, res, next) =>{
      await body('email').trim().notEmpty().isEmail().withMessage('This Email Format Wrong, try different Email Combination').run(req);
      await body('newEmail').trim().notEmpty().isEmail().withMessage('This Email Format Wrong, try different Email Combination').run(req);
      const validation = validationResult(req);
        
      if (validation.isEmpty()) {
        next();
      }else{
          res.status(400).send({
          status : false,
          message : 'Validation failed because validation failed because validation failed',
          error : validation.array()
        });
      }
    },
    ResetPassword : async (req, res, next) =>{
      await body('newPassword').trim().notEmpty().isStrongPassword({
        minLength: 6,
        minNumbers : 1,
        minUppercase: 1,
        minLowercase: 1,
        minSymbols : 1
      }).run(req);
      await body('confirmPassword').trim().notEmpty().equals(req.body.newPassword).withMessage("password didn't match, try to match password").run(req);
  
      const validation = validationResult(req);
      if (validation.isEmpty()) {
        next();
      }else{
          res.status(400).send({
          status : false,
          message : 'Validation failed because validation failed because validation failed',
          error : validation.array()
        });
      }
    },
  }

  export default validator;

  