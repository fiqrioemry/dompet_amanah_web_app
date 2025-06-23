const jwt = require("jsonwebtoken");

const generateToken = (payload: object, secret: string, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export { generateToken, verifyToken };
