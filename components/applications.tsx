import React, { useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ClipLoader from "react-spinners/ClipLoader";

import animation_lmd0dti7 from "../assets/animation_lmd0dti7.json"
import Lottie from "lottie-react";
import { Box } from "@mui/material";

type Application = {
  studentIncome: number;
  householdIncome: number;
  expectedFamilyContribution: number;
  applicationHash: string;
};

export default function Applications() {
  const [records, setRecords] = useState<Application[]>([]);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [processing, setProcessing] = useState(false);

  const addRecord = () => {
    setOpen(true);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file!);
    formData.append("fileName", file!.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    // TODO: call blockchain to create record
    setProcessing(true);
    setTimeout(() => {
      handleClose();
      setRecords([
        {
          studentIncome: 5000,
          householdIncome: 50000,
          expectedFamilyContribution: 5000,
          applicationHash: "0x123456789",
        },
      ]);
      setProcessing(false);
      setFile(undefined);
    }, 10000);
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
      <Dialog open={checkOpen} onClose={handleCheckClose} maxWidth={'sm'} fullWidth>
        <DialogTitle>Check Verification</DialogTitle>
        <DialogContent>
          <Box maxWidth={'100px'}>
            <Lottie animationData={animation_lmd0dti7} loop={false} />
          </Box>
          <DialogContentText>
            Verified
          </DialogContentText>
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
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={addRecord}
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add Record
              </button>
            </div>
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
              {file && <Button onClick={handleSubmit}>Submit</Button>}
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
                        <td colSpan={5} className="px-3 py-4 text-center text-sm text-gray-500">
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
