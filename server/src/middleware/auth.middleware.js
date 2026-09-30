const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader ? "RECEIVED" : "MISSING");

    if (!authHeader) {
      return res.status(401).json({
        message: "authorization token required",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN RECEIVED:", token ? "YES" : "NO");

    console.log("JWT SECRET:", process.env.JWT_SECRET ? "LOADED" : "MISSING");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("JWT VERIFIED:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
      message: "invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
