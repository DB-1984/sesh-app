import express from "express";
import passport from "passport";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

// Start OAuth flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect:
      process.env.NODE_ENV === "production"
        ? "/users/login?oauth=failed"
        : "http://localhost:5173/users/login?oauth=failed",
  }),
  (req, res) => {
    generateToken(res, req.user._id);
  
    const env = process.env.NODE_ENV?.trim();
    console.log(`REDIRECT DEBUG: env is "${env}"`);
  
    // Use a more explicit check
    if (env === "production") {
      console.log("Redirecting to Production path");
      return res.redirect("/oauth-success");
    } else {
      console.log("Redirecting to Local Dev path");
      return res.redirect("http://localhost:5173/oauth-success");
    }
  }
);

export default router;
