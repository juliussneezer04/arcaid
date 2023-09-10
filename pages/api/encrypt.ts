import { clerkClient } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const code = req.body.code;

  // Hash the code using SHA-256
  const hash = crypto.createHash('sha256').update(code).digest('hex');

  return res.status(200).json({ hashedCode: hash });
}
