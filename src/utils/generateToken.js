import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // payload me id + role
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export default generateToken;


// import jwt from "jsonwebtoken";

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "30d"
//   });
// };

// export default generateToken;
