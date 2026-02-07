import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

// OAuth entry-point routes: analogous to Protect middleware,
// but responsible for *creating* auth via Google rather than enforcing it
const router = express.Router();

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd, // true on HTTPS in production
    sameSite: isProd ? "none" : "lax", // cross-site cookies need "none" + secure
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

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
    failureRedirect: `${process.env.FRONTEND_URL}/login?oauth=failed`,
  }),
  (req, res) => {
    // req.user was set by the strategy
    const token = signToken(req.user);
    setAuthCookie(res, token);

    // redirect back to frontend
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success`);
  }
);

export default router;
