import { useRouter } from 'next/router';
import React, { useState, ChangeEvent } from 'react';

export default function Page() {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [fileText, setFileText] = useState<string>('');

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setFileText(text);
        console.log(text);
      };
      reader.readAsText(file);
    }
  };

  const router = useRouter();  // Call useRouter at the top level of your component

  const handleSkip = () => {
    router.push('/dashboard');  // Use the router object here
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalCode = code.join('');

    try {
      const response = await fetch('/api/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receivedHash: fileText,
          code: finalCode,
        }),
      });

      const data = await response.json();

      if (data.match) {
        console.log('Hashes match');
      } else {
        console.log('Hashes do not match', data.error);
      }
    } catch (error) {
      console.error('There was an error sending the data', error);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4 text-center">Authentication</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Enter 6-digit code
            </label>
            <div className="flex justify-center mt-2 space-x-2">
              {code.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  id={`code-box-${index}`}
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg border rounded-md text-black"
                  value={code[index]}
                  onChange={(e) => handleChange(e, index)}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            <button type="submit" className="p-2 bg-blue-500 text-white rounded w-32">
              Submit
            </button>
            <button type="button" className="p-2 bg-gray-500 text-white rounded w-32" onClick={handleSkip}>
              Skip
            </button>
          </div>
          <div className="mt-4">
            <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700">
              Upload a .txt file
            </label>
            <input type="file" id="fileInput" accept=".txt" onChange={handleFileChange} className="mt-2 w-full" />
          </div>
        </form>
      </div>
    </div>
  );
}
