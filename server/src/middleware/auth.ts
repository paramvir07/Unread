import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

const checkAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isAuthenticated } = getAuth(req);
  if (!isAuthenticated)
    return res.status(401).json({ error: "User not authenticated!!" });
  next();
};

const getAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated)
    return res.status(401).json({ error: "User not authenticated!!" });

  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found!!" });

    (req as any).user=user;
    return next();
  } catch (err) {
    return next(err);
  }
  
};
export default {checkAuthenticated, getAuthenticatedUser};
