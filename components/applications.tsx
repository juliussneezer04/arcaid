import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ClipLoader from "react-spinners/ClipLoader";

type Application = {
  studentIncome: string;
  householdIncome: string;
  expectedFamilyContribution: string;
  applicationHash: string;
};

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const getApplications = async () => {
      const response = await fetch("/api/applications");
      let userApplications: Application[] = await response.json();

      userApplications = userApplications.map((application) => ({
        studentIncome: "XXX",
        householdIncome: "XXX",
        expectedFamilyContribution: "XXX",
        applicationHash: application.applicationHash,
      }));
      setApplications(userApplications);
    };

    getApplications();
  }, []);

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

    setProcessing(true);
    const newApplication: Application = {
      studentIncome: "5000",
      householdIncome: "50000",
      expectedFamilyContribution: "5000",
      applicationHash: "0x123456789",
    };

    setTimeout(async () => {
      handleClose();

      // TODO: call blockchain to create record

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

  return (
    <main>
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

          {applications.length > 0 && (
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
                      {applications.map((record, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-3">
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
