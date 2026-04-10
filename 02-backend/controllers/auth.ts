import * as client from "openid-client";
import {
  Strategy,
  type VerifyFunction,
  type StrategyOptions,
} from "openid-client/passport";
import express from "express";
import passport from "passport";
import { ensureLoggedOut } from "connect-ensure-login";
import validRedirect from "../middlewares/valid-redirect";

const authController = express.Router();

const config = await client.discovery(
  new URL(process.env.ISSUER_BASE_URL!),
  process.env.CLIENT_ID!,
  process.env.SECRET!,
  client.ClientSecretPost(process.env.SECRET!),
  {
    execute: [client.allowInsecureRequests],
  },
);

const options: StrategyOptions = {
  config,
  scope: "openid email",
  callbackURL: `${process.env.BASE_URL}/auth/login`,
};

const verify: VerifyFunction = (tokens, verified) => {
  verified(null, {
    ...tokens.claims(),
    id_token: tokens.id_token,
  });
};

passport.use("openid", new Strategy(options, verify));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user: Express.User, cb) => {
  return cb(null, user);
});

authController.get("/check", (req, res) => {
  const user = req.user as {
    preferred_username: string;
    name: string;
    email: string;
  };
  return res.json({
    isAuthenticated: req.isAuthenticated(),
    user: !req.user
      ? null
      : {
          username: user.preferred_username,
          fullName: user.name,
          email: user.email,
        },
  });
});

authController.get(
  "/login",
  validRedirect,
  (req, res, next) =>
    ensureLoggedOut(
      (req as any).session.validRedirectUri ||
        `${req.protocol}://${req.host}/auth/check`,
    )(req, res, next),
  (req, res, next) =>
    passport.authenticate("openid", {
      successRedirect:
        (req as any).session.validRedirectUri ||
        `${req.protocol}://${req.host}/auth/check`,
    })(req, res, next),
);

authController.get("/logout", validRedirect, (req, res) => {
  const { id_token } = req.user as { id_token: string };
  const { validRedirectUri } = (req as any).session;
  req.logout(() => {
    const logoutUrl = client.buildEndSessionUrl(config, {
      id_token_hint: id_token,
      post_logout_redirect_uri:
        validRedirectUri || `${req.protocol}://${req.host}/auth/check`,
    }).href;
    res.json({ url: logoutUrl });
  });
});

export default authController;
