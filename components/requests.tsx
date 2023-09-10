import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Institution, institutionThresholds } from "@/config";
import { handleVerificationOfRecord } from "@/lib/aleo";

type Request = {
  email: string;
  applicationHash: string;
};

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const getRequests = async () => {
      const response = await fetch("/api/applications");
      const userRequests: Request[] = await response.json();
      setRequests(userRequests);
    };

    getRequests();
  }, []);

  const handleVerify = useCallback(async (applicationHash: string) => {
    const institution = Institution.NUS;
    const [threshold1, threshold2, threshold3] =
      institutionThresholds[institution];

    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

    try {
      console.log(
        "Input params",
        applicationHash,
        threshold1,
        threshold2,
        threshold3,
      );
      const res = await handleVerificationOfRecord(
        applicationHash,
        threshold1,
        threshold2,
        threshold3,
        privateKey || "",
      );
      const result = res?.[0] || false;
      alert(result ? "Verified" : "Not verified");
      return result;
    } catch (e) {
      console.error(e);
      alert("User does not meet criteria");
      return false;
    }
  }, []);

  return (
    <main>
      <div className="relative isolate overflow-hidden pt-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-3xl font-medium leading-6 text-gray-900">
                Requests Made
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                An overview of all financial applications made to your school.
              </p>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Application Hash
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                      >
                        <span className="sr-only">Verify</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {requests.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 py-4 text-center text-sm text-gray-500"
                        >
                          <Image
                            src="/arcaid_1.png"
                            width={100}
                            height={100}
                            className="col-span-2 max-h-36 w-full object-contain lg:col-span-1"
                            alt="ArcAid"
                          />
                          No applications found
                        </td>
                      </tr>
                    ) : (
                      requests.map((request) => (
                        <tr key={request.email} className="even:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            {request.email}
                          </td>
                          <td className="truncate whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {request.applicationHash.slice(0, 50) + "...".slice(0, 50) + "..."}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                            <button
                              onClick={() =>
                                handleVerify(request.applicationHash)
                              }
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Verify
                              <span className="sr-only">,</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
