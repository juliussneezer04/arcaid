import React, { useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Lottie from "lottie-react";

import animation_lmd22m25 from "../assets/animation_lmd22m25.json"
import animation_lmd0dti7 from "../assets/animation_lmd0dti7.json";
import StyledDropzone from "./dropzone";


type Application = {
  studentIncome: string;
  householdIncome: string;
  expectedFamilyContribution: string;
  institution: string;
  applicationHash: string;
};

const INSTITUTIONS = [
  "University of Pennsylvania",
  "Boston University",
  "National University of Singapore",
];

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [institution, setInstitution] = useState("");
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getApplications = async () => {
      setLoading(true);
      const response = await fetch("/api/applications");
      let userApplications: Application[] = await response.json();

      userApplications = userApplications.map((application) => ({
        studentIncome: "XXX",
        householdIncome: "XXX",
        expectedFamilyContribution: "XXX",
        institution: application.institution,
        applicationHash: application.applicationHash,
      }));
      setApplications(userApplications);
      setLoading(false);
    };

    getApplications();
  }, []);

  const openApplicationDialogue = () => {
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
    // TODO: call blockchain to get applicationHash

    const newApplication: Application = {
      studentIncome: "5000",
      householdIncome: "50000",
      expectedFamilyContribution: "5000",
      institution: institution,
      applicationHash: "0x123456789",
    };

    setTimeout(async () => {
      await fetch("/api/applications", {
        method: "POST",
        body: JSON.stringify({
          applicationHash: newApplication.applicationHash,
          institution: newApplication.institution,
        }),
      });
      setApplications([...applications, newApplication]);
      setProcessing(false);
      handleClose();
    }, 5000);
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setInstitution("");
  };

  const handleInstitutionChange = (event: SelectChangeEvent) => {
    setInstitution(event.target.value);
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
        <DialogTitle>Check Eligibility</DialogTitle>
        <DialogContent>
          <Box maxWidth={"100px"}>
            <Lottie animationData={animation_lmd0dti7} loop={false} />
          </Box>
          <DialogContentText>
            Eligible
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
                Applications
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all financial aid applications you have made.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={openApplicationDialogue}
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create Application
              </button>
            </div>
          </div>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Financial Aid Application</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {processing ? ("Loading...") : ("Upload your financial document")}
              </DialogContentText>
              {processing ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                  height="100%"
                >
                  <Lottie
                    animationData={animation_lmd22m25}
                    loop={true}
                  />
                </Box>
              ) : (
                <>
                  <StyledDropzone selectedFile={file} setSelectedFile={setFile} />

                  <FormControl fullWidth sx={{ marginTop: 2 }}>
                    <InputLabel id="demo-simple-select-label">
                      Institution
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={institution}
                      label="institution"
                      onChange={handleInstitutionChange}
                    >
                      {INSTITUTIONS.map((school, i) => (
                        <MenuItem key={i} value={school}>
                          {school}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>

              )}
            </DialogContent>

            {!processing && (
              <DialogActions>
                <button
                  className="border border-blue-500 text-blue-500 hover:border-blue-700 hover:text-blue-700 font-bold py-2 px-4 rounded-full mr-2 shadow-sm dark:border-blue-400 dark:text-blue-400 dark:hover:border-blue-300 dark:hover:text-blue-300"
                  onClick={handleClose}>
                  Cancel
                </button>
                {file && institution && (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-sm dark:bg-blue-400 dark:hover:bg-blue-300"
                    onClick={handleSubmit}>
                    Submit
                  </button>
                )}
              </DialogActions>
            )}
          </Dialog >

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
                        Institution
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
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-4 text-center text-sm text-gray-500">
                          <img
                            className="col-span-2 max-h-36 w-full object-contain lg:col-span-1"
                            src="/arcaid (1).png"
                            width={100}
                            height={100}
                          />
                          No records found
                        </td>
                      </tr>
                    ) : (
                      applications.map((application, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-3">
                            {application.studentIncome}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {application.householdIncome}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {application.expectedFamilyContribution}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {application.institution}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {application.applicationHash}
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
                    )
                    }
                  </tbody >
                </table >
              </div >
            </div >
          </div >
        </div >
      </div >
    </main >
  );
}
