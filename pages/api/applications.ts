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
    if (isAdmin || true) {
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
    const { institution, applicationHash } = JSON.parse(req.body);

    if (!applicationHash) {
      return res.status(400).json({ error: "Missing applicationHash" });
    }
    if (!institution) {
      return res.status(400).json({ error: "Missing institution" });
    }

    const createRes = await prisma.application.create({
      data: {
        email: email,
        applicationHash: applicationHash,
        institution: institution,
      },
    });
    if (!createRes) {
      return res.status(500).json({ error: "Failed to save application" });
    }
    return res.status(200).json({ message: "Application saved in database" });
  }
}
