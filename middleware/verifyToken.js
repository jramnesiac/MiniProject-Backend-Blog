import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET;


const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const verifiedToken = jwt.verify(token, 'secretKey');
    req.user = verifiedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'This Token Expired' });
  }
};

export default verifyToken;
