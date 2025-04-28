import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/helper";
import { RESPONSE_CODE } from "../constant";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    res.json(sendResponse({ message: "Access Denied: No token provided", code: 401, status: false }));
    return;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.json(sendResponse({ message: "Invalid token", code: RESPONSE_CODE?.FORBIDDEN, status: false }));
  }
};
