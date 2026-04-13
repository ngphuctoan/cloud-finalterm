import { NextFunction, Request, Response } from "express";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: "Not logged in",
    });
  }
  return next();
};

export default checkAuth;
