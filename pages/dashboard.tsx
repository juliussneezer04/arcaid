import { UserButton } from "@clerk/nextjs";
import { useOrganizationList } from "@clerk/nextjs";
import Applications from "@/components/applications";
import Requests from "@/components/requests";
import { ADMIN_ORG_ID } from "@/utils/constants";

export default function DashboardPage() {
  const { organizationList, isLoaded } = useOrganizationList();
  const isAdmin = organizationList?.find(
    ({ organization }) => organization.id === ADMIN_ORG_ID
  );

  return (
    <div className="h-screen bg-white">
      <header
        className="
        flex
        items-center
        justify-between
        px-4
        py-3
        border-b
        border-gray-200
        sm:px-6
        md:px-8
      "
      >
        <UserButton afterSignOutUrl="/" />
      </header>
      {isAdmin ? <Requests /> : <Applications />}
    </div>
  );
}
