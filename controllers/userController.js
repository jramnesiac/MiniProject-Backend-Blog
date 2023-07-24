import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from '../middleware/transporter.js';
import { Op } from "sequelize";
const secretKey = process.env.JWT_SECRET;
const emailDatabase = process.env.EMAIL_DATABASE;



const userControllers = {
  getUsers: async (req, res) => {
    try {
      const users = await Users.findAll();
      res.json(users);
    } catch (error) {
      console.log(error);      
    }
  },

  registerUsers: async (req, res) => {
    try {
      const { username, email, phoneNumber, password } = req.body;
      const db = await Users.findOne({
        where : {
          [Op.or] : [
            {username},
            {email},
            {phoneNumber},
            {password}
          ]
        }
      });
      if (db == undefined) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const result = await Users.create({ username, email, phoneNumber, password : hashPassword });
        const payload = {id : result.id}
        const token = jwt.sign( payload, 'secretKey' , {expiresIn :'1h'});

      
        // await transporter.sendMail({
        //   from: emailDatabase,
        //   to: email,
        //   subject :'Email Validation',
        //   html : '<h1>Email Validation Successfully</h1>'
        // });
        
        res.status(200).send({
          status : true,
          message : 'Registration Successfully',
          result,
          token
        });
      } else throw{

        massage : "Account already registered"
      }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
  },
  // VERIFICATION
  verificationUsers : async (req, res) => {
    try {
      await Users.update(
        {isVerified : true},
        {
        where : {id : req.user.id}
      })
      res.status(200).send('Verify Successfully registered with email')
    } catch (error) {
        res.status(400).send(error);
    } 
  },

  loginUsers : async (req, res)=> {
    try {
      const {username, email, phoneNumber, password } = req.body;
      if (!username && !email && !phoneNumber) {throw({message:' Login Failed, Please enter your username and email address and try again or eat your password'})}
      if (!password) {throw({message:'Your Password is Wrong, dont forget Your Password, just forget Her'})}
      const data = await Users.findOne({
        where : {
          [Op.or] : [
            {username},
            {email},
            {phoneNumber}
          ]
        }
      });
      if (data == null) { throw ({message : 'This Account not Exist, try different account'})}
      if (!data.isVerified) { throw ({message : 'Your account is not verified, try different account'})}
      const isValid = await bcrypt.compare (password, data.password);
      if (!isValid) { throw ({ message:"Your Password is not valid, try different Password" })}
      const payLoad = {
        id: data.id,
        username:data.username,
        phoneNumber:data.phoneNumber,
        email:data.email,
        imgURL: data.imgURL
      }
      const token = jwt.sign(payLoad, 'secretKey');
      res.status(200).send({
        message : 'Login Success, Enjoy and Explore your 7 sins in this Website',
        token
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },

  forgotPassword : async (req, res) => {
    try {
      const email = req.body.email;
      const isEmailExist = await Users.findOne({
        where: {
          email
        }
      });
  
      if (isEmailExist !== null) {
        const { id, username, email } = isEmailExist;
        const token = jwt.sign({ id, username, email }, 'secretKey');
        // await transporter.sendMail({
        //   from: emailDatabase,
        //   to: email,
        //   subject: 'Change Password Request',
        //   html: '<h1>Change Password Successfully, Darling</h1>'
        // });
        
        res.status(200).send({
          message: 'CHECK YOUR EMAIL, ASAP and dont forget to change your password and dont forget again.',
          token
        });
      } else {
        res.status(404).send({
          message: 'Email not found. Please enter a valid email address.'
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },

  resetPassword : async(req, res) =>{
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.newPassword, salt);
      const setData = await Users.update(
        {password : hashPassword},
        {where :{
          id : req.user.id
        }});
      res.status(200).send({
        message : 'Reset Password Successfully, and dont forget again.'
      });
    } catch (error) {
      console.log(error);
      res.status(200).send(error);
    }
  },

  changePassword : async (req, res) =>{
    try {
      const {oldPassword, newPassword, confirmPassword} = req.body;
      const getData = await Users.findOne({where : {id : req.user.id}})
      const checkPass = await bcrypt.compare(oldPassword , getData.password);
      if (checkPass == false) {
        throw({ message : "Password not Strong, potentialy to hacked" })
      }
      if (newPassword !== confirmPassword) {
        throw({message : "Password didn't match"})
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);
      const setData = await Users.update(
        {password : hashPassword},
        {where :{
          id : req.user.id
        }});
      res.status(200).send({
        message : 'Password Change Successfully, lets explore Again'
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },

  changeUsername : async (req, res) => {
    try {
      const {Username, newUsername} = req.body;
      if (Username !== req.user.username) {
        { throw ({message:`This Username is already in use`})}
      }
      const isUserExist = await Users.findOne({
        where : {
          id : req.user.id
        }
      });

      const updateUsername = await Users.update(
        {username : newUsername},
        {where : {id : req.user.id}}
        
        );
      res.status(200).send({
        message : 'Change Username Success',
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },

  changePhone : async (req, res) => {
    try {
      const {phone, newPhone} = req.body;
      console.log (phone,req.user);
      if (phone !== req.user.phoneNumber) {
        { throw ({message:`Phone Number is Wrong, try to buy a new Phone`})}
      }
      const isUserExist = await Users.findOne({
        where : {
          id : req.user.id
        }
      });
      const update = await Users.update(
        {phone : newPhone},
        {where : {id : req.user.id}}
        );
      res.status(200).send({
        message : 'Change Phone Number is Successfully'
      });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
  },

  changeEmail : async (req, res)=>{
    try {
      const { email, newEmail } = req.body;
      console.log(req.user.email);
      const isEmailExist = await Users.findOne({
        where : {
          email : newEmail
        }
      });
      const {username, phone} = req.user;
      if (isEmailExist == null) {

        const result = await Users.update(
          {isVerified : false},
          {where : {id : req.user.id}}
          );

        const token = jwt.sign({username, email, newEmail, phone }, 'secretKey' , {expiresIn :'1h'});
        // await transporter.sendMail({
        //   from : process.env.EMAIL_DATABASE,
        //   to : email,
        //   subject : 'test',
        //   html :'<h1> Change Email Successfully</h1>'
        // })

        res.status(200).send({
          message : 'Check Your Email, ASAP and dont forget to change your email, and dont forget again',
          token
        });
      }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
  },

  uploadProfile : async (req, res)=>{
    try {
      if (req.file == undefined) {
        throw({ message : 'Try to upload profile picture'});
      }
      // console.log(req.user.id);
      const setData = await Users.update(
        {imageUrl : req.file.filename},
        {where :{
          id : req.user.id
      }});
      // console.log(setData);
      res.status(200).send({
        message : 'Upload Profile Picture Successfully'
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }


};

export default userControllers;
