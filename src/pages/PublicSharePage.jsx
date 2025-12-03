import React, { useEffect, useState } from "react";
import { HiDownload } from "react-icons/hi";
import Panel from "../components/Panel";
import Table from "../components/Table";
import { formatFileSize } from "../utils/formatFileSize";

const PublicSharePage = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles([
      {
        id: 1,
        originalFileName: "Tai lieu Tieng Anh",
        fileSize: 100,
        ownerEmail: "thang@gg.com",
        fileType: "pdf",
      },
    ]);
  }, []);

  const handleclick = () => {
    console.log("Downloading...");
  };

  const config = [
    {
      label: "Name",
      render: (file) => <div className="">{file.originalFileName}</div>,
    },
    {
      label: "Owner",
      render: (file) => file.ownerEmail,
    },
    {
      label: "Type",
      render: (file) => file.fileType,
    },
    {
      label: "Size",
      render: (file) => formatFileSize(file.fileSize),
    },
    {
      label: "",
      render: (file) => (
        <HiDownload className="text-lg cursor-pointer" onClick={handleclick} />
      ),
    },
  ];

  const keyFn = (file) => file.id;
  return (
    <div className="mx-30 my-10">
      <div className="text-2xl font-bold mb-10">FILE SHARE</div>
      {files.length > 0 ? (
        <Panel className="border-gray-300 rounded-lg p-3">
          <Table data={files} config={config} keyFn={keyFn} />
        </Panel>
      ) : (
        <div>FILE NOT FOUND</div>
      )}
    </div>
  );
};

export default PublicSharePage;
