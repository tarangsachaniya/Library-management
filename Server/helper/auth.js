import jwt from 'jsonwebtoken';

export const authmiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header or cookie
    const token =  req.header("Authorization")?.replace("Bearer ", "") || req.cookies.token;
//     console.log(token);
    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    // Attach user ID from token to request object
    req.user = decoded.userId;
    console.log(req.user);
    // Proceed to next middleware or route handler
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};
