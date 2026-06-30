const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    // 1️⃣ Check header exists
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token",
      });
    }

    // 2️⃣ Extract token
    const token = header.split(" ")[1];

    // 3️⃣ Verify token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET, // use ACCESS_SECRET here
    );

    // 4️⃣ Attach user
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

module.exports = authMiddleware;
