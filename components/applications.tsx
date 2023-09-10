import { ARCAID_CREATE_FINANCIAL_RECORD_CODE } from "@/config";
import { useAleoWASM } from "@/hooks/useAleoWASM";
import { Account, ProgramManager } from "@aleohq/sdk";
import React, { useCallback, useState } from "react";
import TimeWarningDialog from "./timeWarningDialog";

export default function Applications() {
  const [isLoading, setIsLoading] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const aleo = useAleoWASM();

  const execute = useCallback(
    async (factor1: number, factor2: number, factor3: number) => {
      setIsLoading(true);
      const programManager = new ProgramManager(
        undefined,
        undefined,
        undefined
      );

      // Create a temporary account for the execution of the program
      const account = new Account();
      programManager.setAccount(account);

      // Get the response and ensure that the program executed correctly
      // WARNING - This function takes a long time on first run
      const executionResponse = await programManager.executeOffline(
        ARCAID_CREATE_FINANCIAL_RECORD_CODE,
        "main",
        [factor1.toString(), factor2.toString(), factor3.toString()].map(
          (x) => `${x}u32`
        ),
        false
      );
      const result = executionResponse.getOutputs();
      alert(`Converted to a Secure Record`);
      setIsLoading(false);
      return result;
    },
    []
  );

  return (
    <main>
      <div className="relative isolate overflow-hidden pt-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-3xl font-medium leading-6 text-gray-900">
                Records
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the medical records you&apos;ve submitted and
                stored!
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <TimeWarningDialog
                isOpen={warningModalOpen}
                setIsOpen={setWarningModalOpen}
                onClose={() => {
                  setIsLoading(true);
                  setTimeout(
                    () => console.log(execute(1000, 10000, 10000)),
                    200
                  );
                }}
                TriggerButton={
                  <button
                    type="button"
                    onClick={() => {
                      setWarningModalOpen(true);
                    }}
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {!isLoading ? (
                      <>Add Record</>
                    ) : (
                      <div className="flex flex-col items-center justify-center animate-pulse">
                        Loading...
                      </div>
                    )}
                  </button>
                }
              />
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
                        Name
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
