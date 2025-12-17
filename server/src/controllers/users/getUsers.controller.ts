import { prisma } from "../../lib/prisma";
import type { Request, Response } from "express";

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    if (!users) return res.status(404).json({ error: "Users not found" });

    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ error: "Error while fetching users" });
  }
};


export default getUsers