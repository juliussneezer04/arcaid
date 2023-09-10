import { ARCAID_CREATE_FINANCIAL_RECORD_CODE } from "@/config";
import { useAleoWASM } from "@/hooks/useAleoWASM";
import { Account, ProgramManager } from "@aleohq/sdk";
import React, { useCallback, useState, useEffect } from "react";
import TimeWarningDialog from "./timeWarningDialog";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ClipLoader from "react-spinners/ClipLoader";
import animation_lmd0dti7 from "../assets/animation_lmd0dti7.json";
import Lottie from "lottie-react";
import { Box } from "@mui/material";
import { GetServerSideProps } from "next";

type Application = {
  studentIncome: number;
  householdIncome: number;
  expectedFamilyContribution: number;
  applicationHash: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetch("/api/applications");
  const userApplications: Application[] = await response.json();
  const hiddenApplications = userApplications.map((application) => ({
    studentIncome: "XXX",
    householdIncome: "XXX",
    expectedFamilyContribution: "XXX",
    applicationHash: application.applicationHash,
  }));

  return {
    props: {
      applications: hiddenApplications,
    },
  };
};

export default function Applications({
  applications: initialApplications,
}: {
  applications?: Application[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [applications, setApplications] = useState<Application[]>(
    initialApplications || []
  );
  const aleo = useAleoWASM();

  const execute = useCallback(
    async (factor1: number, factor2: number, factor3: number) => {
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
      return result?.[0] || "";
    },
    []
  );
  const [records, setRecords] = useState<Application[]>([]);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [processing, setProcessing] = useState(false);

  const addRecord = () => {
    setOpen(true);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setWarningModalOpen(false);
    const formData = new FormData();
    formData.append("file", file!);
    formData.append("fileName", file!.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    setProcessing(true);

    const studentIncome = 5000;
    const householdIncome = 50000;
    const expectedFamilyContribution = 5000;
    const hashValue = await execute(
      studentIncome,
      householdIncome,
      expectedFamilyContribution
    );

    const newApplication: Application = {
      studentIncome,
      householdIncome,
      expectedFamilyContribution,
      applicationHash: hashValue,
    };
    setTimeout(async () => {
      handleClose();

      setApplications([...applications, newApplication]);
      await fetch("/api/applications", {
        method: "POST",
        body: JSON.stringify({
          applicationHash: newApplication.applicationHash,
        }),
      });
      setProcessing(false);
      setFile(undefined);
    }, 5000);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const [checkOpen, setCheckOpen] = useState(false);

  const handleCheck = useCallback(() => {
    setCheckOpen(true);
  }, []);

  const handleCheckClose = () => {
    setCheckOpen(false);
  };

  return (
    <main>
      <Dialog
        open={checkOpen}
        onClose={handleCheckClose}
        maxWidth={"sm"}
        fullWidth
      >
        <DialogTitle>Check Verification</DialogTitle>
        <DialogContent>
          <Box maxWidth={"100px"}>
            <Lottie animationData={animation_lmd0dti7} loop={false} />
          </Box>
          <DialogContentText>Verified</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCheckClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <div className="relative isolate overflow-hidden pt-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-3xl font-medium leading-6 text-gray-900">
                Records
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the financial aid applications you have made.
              </p>
            </div>
          </div>
          <TimeWarningDialog
            isOpen={warningModalOpen}
            setIsOpen={setWarningModalOpen}
            onClose={handleSubmit}
          />
          <div className="-mt-6 flex justify-end">
            <Button onClick={addRecord}>Add Record</Button>
          </div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Financial Aid Application</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Upload your financial document.
              </DialogContentText>
            </DialogContent>

            {file ? (
              <DialogContent className="flex items-center justify-center">
                {processing ? (
                  <ClipLoader loading={processing} />
                ) : (
                  <DialogContentText>{file.name}</DialogContentText>
                )}
              </DialogContent>
            ) : (
              <Button component="label">
                Upload
                <input type="file" hidden onChange={handleFileUpload} />
              </Button>
            )}

            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              {file && (
                <Button
                  onClick={() => {
                    setWarningModalOpen(true);
                    handleClose();
                  }}
                >
                  Submit
                </Button>
              )}
            </DialogActions>
          </Dialog>

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
                        Student Income
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Household Income
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Expected Family Contribution
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Application Hash
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {records.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 py-4 text-center text-sm text-gray-500"
                        >
                          No rows available
                        </td>
                      </tr>
                    ) : (
                      records.map((record, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            {record.studentIncome}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {record.householdIncome}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {record.expectedFamilyContribution}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {record.applicationHash}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <button
                              onClick={handleCheck}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Check Eligibility
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
