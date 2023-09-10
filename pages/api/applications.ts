import { clerkClient } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/db";
import { ADMIN_ORG_ID } from "@/lib/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = userId ? await clerkClient.users.getUser(userId) : null;
  const email = user?.emailAddresses[0].emailAddress!;
  const adminMemberships =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: ADMIN_ORG_ID,
    });
  const isAdmin = adminMemberships.some(
    (membership) => membership.publicUserData?.userId === userId
  );

  if (req.method === "GET") {
    let applications;
    if (isAdmin) {
      applications = await prisma.application.findMany();
    } else {
      applications = await prisma.application.findMany({
        where: {
          email: email,
        },
      });
    }
    return res.status(200).json(applications);
  } else if (req.method === "POST") {
    const applicationHash = JSON.parse(req.body).applicationHash;

    if (!applicationHash) {
      return res.status(400).json({ error: "Missing applicationHash" });
    }

    await prisma.application.create({
      data: {
        email: email,
        applicationHash: applicationHash,
      },
    });
    return res.status(200).json({ message: "Application saved in database" });
  }
}
