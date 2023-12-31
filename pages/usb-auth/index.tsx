import { useRouter } from "next/router";
import { useState, ChangeEvent, useEffect } from "react";

import animation_lmcw3nkq from "../../assets/animation_lmcw3nkq.json";
import Lottie from "lottie-react";
import StyledDropzone from "@/components/dropzone";

export default function Page() {
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState<string>("");

  useEffect(() => {
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setFileText(text);
        console.log(text);
      };
      reader.readAsText(file);

      setFileUploaded(true);
    }
  }, [file]);

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({ visible: false, message: "", type: "success" });

  const hideToast = () => {
    setToast({ visible: false, message: "", type: "success" });
  };

  const router = useRouter(); // Call useRouter at the top level of your component

  const handleSkip = () => {
    router.push("/dashboard"); // Use the router object here
  };

  const handleSubmit = async () => {
    const finalCode = code.join("");

    try {
      const response = await fetch("/api/decrypt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receivedHash: fileText,
          code: finalCode,
        }),
      });

      const data = await response.json();

      setCode(Array(6).fill(""));

      if (data.match) {
        console.log("Hashes match");
        setToast({
          visible: true,
          message: "USB Authentication Succeeded",
          type: "success",
        });
        setTimeout(hideToast, 2000);

        handleSkip();
      } else {
        console.log("Hashes do not match", data.error);
        setFileUploaded(false);
        setToast({
          visible: true,
          message: "USB Authentication Failed",
          type: "error",
        });
        setTimeout(hideToast, 2000);
      }
    } catch (error) {
      console.error("There was an error sending the data", error);
      setToast({ visible: true, message: "An error occurred", type: "error" });
      setTimeout(hideToast, 2000);
    }
  };

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
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

    // Check if all code boxes are filled
    if (code.every((c) => c !== "")) {
      await handleSubmit();
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      {toast.visible && (
        <div
          className={`fixed right-4 top-4 z-50 rounded p-4 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          <button
            onClick={() =>
              setToast({ visible: false, message: "", type: "success" })
            }
            className="absolute right-1 top-1 text-white"
          >
            X
          </button>
          <div>{toast.message}</div>
        </div>
      )}

      <div className="w-96 rounded-lg bg-white p-8 shadow-md">
        {toast.type === "success" && toast.visible ? (
          <Lottie animationData={animation_lmcw3nkq} loop={true} />
        ) : (
          <>
            {" "}
            <h1 className="mb-4 text-center text-2xl font-semibold">
              USB Authentication
            </h1>
            <form onSubmit={handleSubmit}>
              {!fileUploaded && (
                <div className="mt-4">
                  <label
                    htmlFor="fileInput"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload your _file.txt
                  </label>
                  <StyledDropzone
                    selectedFile={file}
                    setSelectedFile={setFile}
                  />
                </div>
              )}

              {fileUploaded && (
                <div className="mb-4">
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter your 6-digit code
                  </label>
                  <div className="mt-2 flex justify-center space-x-2">
                    {code.map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        id={`code-box-${index}`}
                        maxLength={1}
                        className="h-12 w-12 rounded-md border text-center text-lg text-black"
                        value={code[index]}
                        onChange={(e) => handleChange(e, index)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-start">
                <button
                  type="button"
                  className="text-blue text-sm underline"
                  onClick={handleSkip}
                >
                  Skip
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
