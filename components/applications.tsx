import { useAleoWASM } from "@/hooks/useAleoWASM";
import {
  Account,
  PrivateKey,
  AleoKeyProvider,
  AleoNetworkClient,
  NetworkRecordProvider,
  ProgramManager,
  KeySearchParams,
} from "@aleohq/sdk";
import React, { useState, useEffect, use } from "react";

export default function Applications() {
  const aleo = useAleoWASM();
  const [account, setAccount] = useState<PrivateKey | null>(null);
  const [worker, setWorker] = useState<Worker | null>(null);

  const generateAccount = () => {
    setAccount(new aleo.PrivateKey());
  };

  useEffect(() => {
    if (worker === null) {
      const spawnedWorker = spawnWorker();
      setWorker(spawnedWorker);
      return () => {
        spawnedWorker.terminate();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function spawnWorker() {
    return new Worker(new URL("workers/worker.js", import.meta.url), {
      type: "module",
    });
  }

  function postMessagePromise(worker: Worker, message: any) {
    return new Promise((resolve, reject) => {
      worker.onmessage = (event) => {
        resolve(event.data);
      };
      worker.onerror = (error) => {
        reject(error);
      };
      worker.postMessage(message);
    });
  }

  async function execute() {
    const hello_hello_program =
      "program hello_hello.aleo;\n" +
      "\n" +
      "function hello:\n" +
      "    input r0 as u32.public;\n" +
      "    input r1 as u32.private;\n" +
      "    add r0 r1 into r2;\n" +
      "    output r2 as u32.private;\n";

    const acct = new Account();

    // Create a key provider that will be used to find public proving & verifying keys for Aleo programs
    const keyProvider = new AleoKeyProvider();
    keyProvider.useCache(true);

    // Create a record provider that will be used to find records and transaction data for Aleo programs
    const networkClient = new AleoNetworkClient("https://vm.aleo.org/api");
    const recordProvider = new NetworkRecordProvider(acct, networkClient);

    // Initialize a program manager to talk to the Aleo network with the configured key and record providers
    const programName = "hello_hello.aleo";
    const programManager = new ProgramManager(
      "https://vm.aleo.org/api",
      keyProvider,
      recordProvider
    );

    // Provide a key search parameter to find the correct key for the program if they are stored in a memory cache
    const keySearchParams = { cacheKey: "hello_hello:hello" };
    const tx_id = await programManager.execute(
      programName,
      "hello_hello",
      0.02,
      ["5u32", "5u32"],
      undefined,
      keySearchParams,
      undefined,
      undefined
    );
    if (tx_id instanceof Error) {
      throw tx_id;
    }
    const transaction = await programManager.networkClient.getTransaction(
      tx_id
    );
    alert("Transaction ID: " + tx_id);
    console.log("Transaction: ", transaction);
    // if (!worker) {
    //   return;
    // }
    // if (!account) {
    //   return;
    // }
    // const result = await postMessagePromise(worker, {
    //   type: "ALEO_EXECUTE_PROGRAM_LOCAL",
    //   localProgram: hello_hello_program,
    //   aleoFunction: "hello",
    //   inputs: ["5u32", "5u32"],
    //   privateKey: account.to_string(),
    // });

    // alert(JSON.stringify(result));
  }

  return (
    <main>
      <div className="relative isolate overflow-hidden pt-8">
        {
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
                <button
                  type="button"
                  onClick={execute}
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add Record
                </button>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button
                  type="button"
                  onClick={generateAccount}
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Generate Account
                </button>
              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  {/* <table className="min-w-full divide-y divide-gray-300">
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
                </table> */}
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </main>
  );
}
