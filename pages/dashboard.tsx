import { UserButton } from "@clerk/nextjs";
import { useOrganizationList } from "@clerk/nextjs";

import Applications from "@/components/applications";
import Requests from "@/components/requests";
import { ADMIN_ORG_ID } from "@/lib/constants";
import { Dialog } from "@headlessui/react";
import { Button, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@mui/material";
import { ChangeEvent, useState } from "react";
import animation_lmcw3nkq from "../assets/animation_lmcw3nkq.json";
import Lottie from "lottie-react";

export default function DashboardPage() {
  const { userMemberships, isLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const isAdmin = userMemberships?.data?.find(
    (mem) => mem.organization.id === ADMIN_ORG_ID
  );

  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [code, setCode] = useState(Array(6).fill(''));
  const [encryptedString, setEncryptedString] = useState('');

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    let value = e.target.value;

    if (/[^0-9]/.test(value)) {
      return;
    }

    code[index] = value;

    if (index < code.length - 1 && value !== '') {
      const nextElement = document.getElementById(`code-box-${index + 1}`);
      if (nextElement) {
        nextElement.focus();
      }
    }

    setCode([...code]);
  };

  const handleSubmit = async () => {
    try {
      const finalCode = code.join('');

      const response = await fetch('/api/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: finalCode }),
      });
      const data = await response.json();
      setEncryptedString(data.hashedCode);
      console.log(data.hashedCode)

      // Create a Blob and save it as file.txt
      const blob = new Blob([data.hashedCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '_file.txt';
      a.click();
      URL.revokeObjectURL(url);

      setIsDownloadPopupOpen(true);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress(prev => prev + 50);
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        setIsDownloadPopupOpen(false);
      }, 2000);

      closeDialog();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isLoaded) {
    return (<>
      <Lottie animationData={animation_lmcw3nkq} loop={true} />
    </>)
  }

  return (
    <>
      <div className={isDownloadPopupOpen ? "fixed bottom-4 left-4 z-50 bg-white p-8 rounded-lg max-h-60 w-1/3 dark:bg-gray-700" : "hidden"}>
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsDownloadPopupOpen(false)}
        >
          <svg className="w-6 h-6 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h1 className="text-lg font-semibold mb-4 dark:text-gray-200">Download Complete</h1>
        <p className="mb-4 dark:text-gray-300">The file.txt has been downloaded to your default folder.</p>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-400">
            <div style={{ width: `${Math.min(100, (progress / 2000) * 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 dark:bg-blue-300"></div>
          </div>
        </div>
      </div>

      <header className="flex justify-end py-6 px-12 bg-white dark:bg-gray-800 shadow-md">
        <UserButton afterSignOutUrl="/" />
      </header>

      {isAdmin ? <Requests /> : <Applications />}

      <div className={`fixed inset-0 flex items-center justify-center ${isDialogOpen ? '' : 'hidden'} bg-opacity-50 dark:bg-gray-800`}>
        <div className="bg-white p-10 rounded-lg w-1/3 shadow-lg dark:bg-gray-700">
          <h1 className="text-center text-lg font-semibold mb-6 dark:text-gray-200">Create a new USB Encryption File</h1>
          <p className="text-center mb-6 dark:text-gray-300">Please enter a 6-digit code below.</p>
          <div className="flex justify-center space-x-2 mb-6">
            {code.map((_, index) => (
              <input
                key={index}
                type="text"
                id={`code-box-${index}`}
                maxLength={1}
                className="w-12 h-12 text-center text-lg border rounded-md text-black shadow-sm focus:ring focus:ring-opacity-50 dark:bg-gray-600 dark:text-gray-300"
                value={code[index]}
                onChange={(e) => handleChange(e, index)}
              />
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="border border-blue-500 text-blue-500 hover:border-blue-700 hover:text-blue-700 font-bold py-2 px-4 rounded-full mr-2 shadow-sm dark:border-blue-400 dark:text-blue-400 dark:hover:border-blue-300 dark:hover:text-blue-300"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-sm dark:bg-blue-400 dark:hover:bg-blue-300"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <button
        className={isDialogOpen ? "hidden" : "absolute bottom-4 left-4 z-50 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full dark:bg-blue-400 dark:hover:bg-blue-300"}
        onClick={openDialog}
      >
        Generate USB Encryption
      </button>
    </>
  );
}