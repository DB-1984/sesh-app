import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET, 
    { expiresIn: "30d" } // or however long you want
  );
};

export default generateToken;
