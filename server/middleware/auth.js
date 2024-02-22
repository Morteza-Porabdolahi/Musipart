const jwt = require("jsonwebtoken");
const { secretKey } = require("./config");

const generateToken = (payload) => {
  const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });
  return token;
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided !" });
  } else {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        res.locals.userId = decoded.user.userId;
        next();
      }
    });
  }
};

module.exports = { verifyToken, generateToken };
