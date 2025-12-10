import React, { useEffect, useState } from "react";
import { HiDownload, HiEye } from "react-icons/hi";
import Panel from "../components/Panel";
import Table from "../components/Table";
import { formatFileSize } from "../utils/formatFileSize";
import { getPublicFileInfo } from "../services/fileShareService";
import { redirect, useLoaderData } from "react-router-dom";
import { getFileNameFromContentDisposition } from "../utils/getFileName";
import { saveAs } from "file-saver";
import { downloadPublicFile } from "../services/fileShareService";
import FilePreview from "../components/FilePreview";
import { toast } from "react-toastify";

export const loader = async (request) => {
  try {
    const { token } = request.params;
    const data = await getPublicFileInfo(token);
    if (data === null) {
      return redirect("/login");
    }
    return data;
  } catch (error) {
    return null;
  }
};

const PublicSharePage = () => {
  const data = useLoaderData();
  if (data?.status === 404 || data?.status === "404") {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1>FILE NOT FOUND</h1>
      </div>
    );
  }

  const [files, setFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    setFiles([
      {
        id: data.fileId,
        originalFileName: data.originalFileName,
        fileSize: data.fileSize,
        createdAt: data.createdAt,
        fileType: data.fileType,
        fileId: data.fileId,
        publicLinkId: data.publicLinkId,
        token: data.token,
      },
    ]);
  }, []);

  const handleclick = async (token) => {
    if (!isDownloaded) {
      handleDownload(token);
      setIsDownloaded(true);
    }
  };

  const handleDownload = async (token) => {
    setIsDownloading(true);
    try {
      const response = await downloadPublicFile(token);

      // Tạo Blob từ dữ liệu và download file
      const blob = new Blob([response.data]);

      // Lấy tên file từ header
      const contentDisposition = response.headers["content-disposition"];
      const downloadFileName =
        getFileNameFromContentDisposition(contentDisposition) ||
        "downloaded_file";

      saveAs(blob, downloadFileName);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = async (file) => {
    if (
      file.fileType === "application/pdf" ||
      file.fileType === "image/png" ||
      file.fileType === "image/jpeg" ||
      file.fileType === "image/jpg" ||
      file.fileType === "text/plain"
    ) {
      setFilePreview(file);
      setShowPreview(true);
    } else {
      toast.warning("Cannot view this file");
    }
  };

  const config = [
    {
      label: "Name",
      render: (file) => <div className="">{file.originalFileName}</div>,
    },
    {
      label: "Date",
      render: (file) => file.createdAt?.replace("T", " ").slice(0, 19),
    },
    {
      label: "Type",
      render: (file) => file.fileType,
    },
    {
      label: "Size",
      render: (file) => formatFileSize(file.fileSize),
    },
    // {
    //   label: "View",
    //   render: (file) => (
    //     <HiEye
    //       className="text-lg cursor-pointer"
    //       onClick={() => handlePreview(file)}
    //     />
    //   ),
    // },
    {
      label: "",
      render: (file) => (
        <HiDownload
          className="text-lg cursor-pointer"
          onClick={() => handleclick(file.token)}
        />
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

      {showPreview && (
        <FilePreview file={filePreview} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};

export default PublicSharePage;
