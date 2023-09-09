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

  const receivedHash = req.body.receivedHash;
  const code = req.body.code;

  // Hash the code using SHA-256
  const calculatedHash = crypto.createHash('sha256').update(code).digest('hex');

  // Check if the calculated hash matches the received hash
  if (calculatedHash === receivedHash) {
    return res.status(200).json({ match: true });
  } else {
    return res.status(400).json({ match: false, error: "Hashes do not match" });
  }
}
