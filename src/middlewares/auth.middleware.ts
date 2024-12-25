import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if (req.path.includes("/auth")) {
    return next();
  }

  const authHeader: string | undefined = req.headers["authorization"];
  const token: string | undefined = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.error(err, user);
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};

export default authenticate;
