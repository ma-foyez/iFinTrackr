const jwt = require("jsonwebtoken");

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
};


const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
  
      try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        // Attach the user object to the request
        req.user = decoded;
  
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Invalid access token.");
      }
    } else {
      res.status(401);
      throw new Error("Access token not provided.");
    }
  };

module.exports = {
    notFound,
    errorHandler,
    authenticateToken
}