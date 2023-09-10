import { UserButton } from "@clerk/nextjs";
import { useOrganizationList } from "@clerk/nextjs";

import Applications from "@/components/applications";
import Requests from "@/components/requests";
import { ADMIN_ORG_ID } from "@/lib/constants";

export default function DashboardPage() {
  const { userMemberships, isLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!isLoaded) {
    return <>Loading</>;
  }

  const isAdmin = userMemberships?.data?.find(
    (mem) => mem.organization.id === ADMIN_ORG_ID
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
