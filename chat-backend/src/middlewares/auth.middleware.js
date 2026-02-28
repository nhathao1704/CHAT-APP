// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";// check token trong header authorization 

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token không hợp lệ" });
    }

    // attach userId from token (JWT encodes it as userId, not id)
    req.userId = decoded.userId;
    req.user = { id: decoded.userId };
    next();
  });
};

export default authMiddleware;
