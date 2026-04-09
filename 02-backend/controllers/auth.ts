import express from "express";
import passport from "passport";
import OpenIDConnectStrategy, {
  Profile,
  VerifyCallback,
} from "passport-openidconnect";
import qs from "node:querystring";

const authController = express.Router();

passport.use(
  new OpenIDConnectStrategy(
    {
      issuer: process.env.ISSUER_BASE_URL!,
      authorizationURL: `${process.env.ISSUER_BASE_URL}/protocol/openid-connect/auth`,
      tokenURL: `${process.env.ISSUER_BASE_URL}/protocol/openid-connect/token`,
      userInfoURL: `${process.env.ISSUER_BASE_URL}/protocol/openid-connect/userinfo`,
      clientID: process.env.CLIENT_ID!,
      clientSecret: process.env.SECRET!,
      callbackURL: "/auth/oauth2/redirect",
      scope: ["profile"],
    },
    (issuer: string, profile: Profile, cb: VerifyCallback) => {
      return cb(null, profile);
    },
  ),
);

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    const profile = user as Profile;
    cb(null, {
      id: profile.id,
      username: profile.username,
      fullName: profile.displayName,
      email: profile.emails?.[0].value,
    });
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, user as Express.User);
  });
});

authController.get("/check", (req, res) => {
  return res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user || null,
  });
});

authController.get("/login", passport.authenticate("openidconnect"));

authController.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    var params = {
      client_id: process.env.CLIENT_ID!,
      returnTo: "http://localhost:5173",
    };
    return res.json({
      url: `${process.env.ISSUER_BASE_URL}/protocol/openid-connect/logout?${qs.stringify(params)}`,
    });
  });
});

authController.get(
  "/oauth2/redirect",
  passport.authenticate("openidconnect", {
    successRedirect: "http://localhost:5173",
    failureRedirect: "/auth/login",
  }),
);

export default authController;
