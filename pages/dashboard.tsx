import { UserButton } from "@clerk/nextjs";
import { useOrganizationList } from "@clerk/nextjs";

import Applications from "@/components/applications";
import Requests from "@/components/requests";
import { ADMIN_ORG_ID } from "@/lib/constants";
import { Dialog } from "@headlessui/react";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from "@mui/material";
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
    (mem) => mem.organization.id === ADMIN_ORG_ID,
  );

  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [code, setCode] = useState(Array(6).fill(""));
  const [encryptedString, setEncryptedString] = useState("");

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    let value = e.target.value;

    if (/[^0-9]/.test(value)) {
      return;
    }

    code[index] = value;

    if (index < code.length - 1 && value !== "") {
      const nextElement = document.getElementById(`code-box-${index + 1}`);
      if (nextElement) {
        nextElement.focus();
      }
    }

    setCode([...code]);
  };

  const handleSubmit = async () => {
    try {
      const finalCode = code.join("");

      const response = await fetch("/api/encrypt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: finalCode }),
      });
      const data = await response.json();
      setEncryptedString(data.hashedCode);
      console.log(data.hashedCode);

      // Create a Blob and save it as file.txt
      const blob = new Blob([data.hashedCode], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "_file.txt";
      a.click();
      URL.revokeObjectURL(url);

      setIsDownloadPopupOpen(true);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prev) => prev + 50);
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        setIsDownloadPopupOpen(false);
      }, 2000);

      closeDialog();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isLoaded) {
    return (
      <>
        <Lottie animationData={animation_lmcw3nkq} loop={true} />
      </>
    );
  }

  return (
    <>
      <div
        className={
          isDownloadPopupOpen
            ? "fixed bottom-4 left-4 z-50 max-h-60 w-1/3 rounded-lg bg-white p-8 dark:bg-gray-700"
            : "hidden"
        }
      >
        <button
          className="absolute right-4 top-4"
          onClick={() => setIsDownloadPopupOpen(false)}
        >
          <svg
            className="h-6 w-6 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <h1 className="mb-4 text-lg font-semibold dark:text-gray-200">
          Download Complete
        </h1>
        <p className="mb-4 dark:text-gray-300">
          The file.txt has been downloaded to your default folder.
        </p>
        <div className="relative pt-1">
          <div className="mb-4 flex h-2 overflow-hidden rounded bg-blue-200 text-xs dark:bg-blue-400">
            <div
              style={{ width: `${Math.min(100, (progress / 2000) * 100)}%` }}
              className="flex flex-col justify-center whitespace-nowrap bg-blue-500 text-center text-white shadow-none dark:bg-blue-300"
            ></div>
          </div>
        </div>
      </div>

      <header className="flex justify-end bg-white px-12 py-6 shadow-md dark:bg-gray-800">
        <UserButton afterSignOutUrl="/" />
      </header>

      {isAdmin ? <Requests /> : <Applications />}

      <div
        className={`fixed inset-0 flex items-center justify-center ${
          isDialogOpen ? "" : "hidden"
        } bg-opacity-50 dark:bg-gray-800`}
      >
        <div className="w-1/3 rounded-lg bg-white p-10 shadow-lg dark:bg-gray-700">
          <h1 className="mb-6 text-center text-lg font-semibold dark:text-gray-200">
            Create a new USB Encryption File
          </h1>
          <p className="mb-6 text-center dark:text-gray-300">
            Please enter a 6-digit code below.
          </p>
          <div className="mb-6 flex justify-center space-x-2">
            {code.map((_, index) => (
              <input
                key={index}
                type="text"
                id={`code-box-${index}`}
                maxLength={1}
                className="h-12 w-12 rounded-md border text-center text-lg text-black shadow-sm focus:ring focus:ring-opacity-50 dark:bg-gray-600 dark:text-gray-300"
                value={code[index]}
                onChange={(e) => handleChange(e, index)}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <button
              className="mr-2 rounded-full border border-blue-500 px-4 py-2 font-bold text-blue-500 shadow-sm hover:border-blue-700 hover:text-blue-700 dark:border-blue-400 dark:text-blue-400 dark:hover:border-blue-300 dark:hover:text-blue-300"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button
              className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white shadow-sm hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-300"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <button
        className={
          isDialogOpen
            ? "hidden"
            : "absolute bottom-4 left-4 z-50 rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-300"
        }
        onClick={openDialog}
      >
        Generate USB Encryption
      </button>
    </>
  );
}
