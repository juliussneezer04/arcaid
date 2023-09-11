import React, { FC, useMemo } from "react";
import { useDropzone } from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

interface StyledDropzoneProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

const StyledDropzone: FC<StyledDropzoneProps> = ({
  selectedFile,
  setSelectedFile,
}) => {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    // accept: { "document/*": [], "text/*": [] },
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    },
    maxFiles: 1,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  return (
    <div className="dropzone-container">
      <div
        {...getRootProps({
          className: "dropzone",
          style,
        } as React.HTMLProps<HTMLDivElement>)}
      >
        <input {...getInputProps()} />
        <p>Drag &apos;n&apos; drop a file here, or click to select a file</p>
      </div>
      {selectedFile && (
        <div className="selected-file">
          <h4>Selected File:</h4>
          <p>{selectedFile.name}</p>
        </div>
      )}
    </div>
  );
};

export default StyledDropzone;
