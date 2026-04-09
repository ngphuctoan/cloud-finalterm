import express from "express";

const authController = express.Router();

authController.get("/check", (req, res) => {
  const result = {
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user
      ? {
          username: req.oidc.user.preferred_username,
          fullName: req.oidc.user.name,
          email: req.oidc.user.email,
        }
      : null,
  };
  return res.json(result);
});

authController.get("/login", (req, res) => {
  return res.oidc.login({
    returnTo: "/auth/check",
  });
});

authController.get("/logout", (req, res) => {
  return res.oidc.logout();
});

authController.post("/callback", (req, res) => {
  return res.oidc.callback();
});

export default authController;
