import jwt from 'jsonwebtoken';

const JWT_SECRET = 'cle_secrete';

export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};
