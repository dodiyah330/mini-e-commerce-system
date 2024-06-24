const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["auth-token"];
  if (!authHeader) return res.status(401).send("Access Denied");

  try {
    const token = authHeader && authHeader.split(" ")[1];
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

module.exports = verifyToken;
