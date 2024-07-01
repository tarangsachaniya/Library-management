import jwt from 'jsonwebtoken';

export const authmiddleware = async (req, res, next) => {
  try {
    const token =  req.header("Authorization")?.replace("Bearer ", "") || req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};
