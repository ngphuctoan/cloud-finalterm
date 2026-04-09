import { NextFunction, Request, Response } from "express";
import * as v from "valibot";

const parseDto =
  <const B extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
    dto: B,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const result = v.safeParse(dto, req.body);
    if (!result.success) {
      return res.status(400).json(v.flatten(result.issues));
    }
    req.body = result.output;
    return next();
  };

export default parseDto;
