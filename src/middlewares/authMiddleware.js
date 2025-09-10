import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Protect: only logged in users allowed
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user || user.isDeleted) {
        return res.status(401).json({ message: "User not found or deleted" });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Role-based access control
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (allowedRoles.length === 0 || allowedRoles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({ message: "You do not have permission" });
    }
  };
};




// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization?.startsWith("Bearer")) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log("decoded: ", decoded);

//       req.user = await User.findById(decoded.id).select("-password");
//       next();
//     } catch (error) {
//       res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: "No token, authorization denied" });
//   }
// };
