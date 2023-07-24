import express from 'express';
import userControllers from '../controllers/UserController.js';
import validator from '../middleware/validator.js';
import verifyToken from '../middleware/verifyToken.js';
import authLoginUsers from '../controllers/keepLogin.js';
import multerUpload from '../middleware/multer.js';

const router = express.Router();

router.get('/users', userControllers.getUsers);
router.post('/register', validator.registerValidation, userControllers.registerUsers);
router.patch('/verify', verifyToken, userControllers.verificationUsers);
router.post('/login', userControllers.loginUsers);
router.get('/auth', verifyToken, authLoginUsers.keepLogin);
router.put('/forgotPassword',userControllers.forgotPassword);
router.patch('/resetPassword', verifyToken, validator.ResetPassword, userControllers.resetPassword);
router.patch('/changePassword', verifyToken, validator.changePassword , userControllers.changePassword);
router.patch('/changeUsername', verifyToken, validator.changeUsername , userControllers.changeUsername);
router.patch('/changePhoneNumber', verifyToken, validator.changePhoneNumber, userControllers.changePhone);
router.patch('/changeEmail', verifyToken, validator.changeEmail, userControllers.changeEmail);
router.post('/changeProfile', verifyToken, multerUpload ('./public/Profile', 'profile').single('file') , userControllers.uploadProfile);
export default router;
