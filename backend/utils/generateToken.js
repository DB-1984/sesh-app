import jwt from 'jsonwebtoken';

// a reusable tool for setting cookies - using userId as an unset value, to be defined where the function is called
const generateToken = (res, userId) =>{
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "30d", // for course purposes
          });
      
          // set the JWT in a http cookie sent with every response to requests to authUser
          res.cookie("jwt", token, {
            httpOnly: true,
             secure: false, // need https in production, so true only if not in dev
            sameSite: "strict", // protect against XSS
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
          });
      
}

export default generateToken;