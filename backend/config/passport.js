import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

// Defines how Passport should handle Google OAuth (login / signup).
// Passport is a singleton: this configuration mutates the shared Passport instance.
// Any route that uses `passport.authenticate("google")` will execute the logic defined here.

export function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          const googleId = profile.id;
          const name = profile.displayName || "Google User";

          if (!email) {
            return done(null, false, {
              message: "No email returned from Google.",
            });
          }

          // 1) If this googleId already exists, log them in
          let user = await User.findOne({ googleId });

          if (!user) {
            // 2) If an account exists with the same email:
            // Decide whether to link or block.
            // Common approach: link it (set provider/googleId if local user).
            user = await User.findOne({ email });

            if (user) {
              // If you want to prevent linking automatically, you could reject here.
              user.googleId = googleId;
              user.provider = user.provider || "local"; // keep local if it was local
              if (!user.name) user.name = name;
              await user.save();
            } else {
              // 3) Create a new user
              user = await User.create({
                name,
                email,
                provider: "google",
                googleId,
                // no password
              });
            }
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}
