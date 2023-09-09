import { UserButton } from "@clerk/nextjs";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";

import Applications from "@/components/applications";
import Requests from "@/components/requests";
import { ADMIN_ORG_ID } from "@/utils/constants";

export default function DashboardPage() {
  const { organizationList, isLoaded } = useOrganizationList();
  const isAdmin = organizationList?.find(
    ({ organization }) => organization.id === ADMIN_ORG_ID
  );

  return (
    <>
      <header className="flex justify-end py-5 px-10">
        <UserButton afterSignOutUrl="/" />
      </header>
      {isAdmin ? <Requests /> : <Applications />}
    </>
  );
}
