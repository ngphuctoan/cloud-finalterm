import { NextFunction, Request, Response } from "express";

const validRedirect = (req: Request, res: Response, next: NextFunction) => {
  const { redirect_uri } = req.query;

  if (!redirect_uri) {
    return next();
  }

  if (
    process.env
      .ALLOWED_REDIRECTS!.split(",")
      .includes(new URL(redirect_uri as string).origin)
  ) {
    (req as any).session.validRedirectUri = redirect_uri;
    return next();
  }

  return res.status(400).json({
    message: "Redirect not allowed",
  });
};

export default validRedirect;
