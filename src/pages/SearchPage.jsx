import React, { useState } from "react";
import Table from "../components/Table";
import Panel from "../components/Panel";
import {
  HiOutlineDotsHorizontal,
  HiDownload,
  HiShare,
  HiTrash,
  HiEye,
} from "react-icons/hi";
import FileMenu from "../components/FileMenu";
import FileShareModal from "../components/FileShareModal";
import { downloadFile, searchFiles, deleteFile } from "../services/fileService";
import { redirect, useLoaderData } from "react-router-dom";
import { saveAs } from "file-saver";
import { formatFileSize } from "../utils/formatFileSize";
import { getFileNameFromContentDisposition } from "../utils/getFileName";
import FilePreview from "../components/FilePreview";

export const loader = async (request) => {
  const { term } = request.params;
  try {
    if (term === "") return redirect("/files");
    const data = await searchFiles(term);
    return { data, term };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const SearchPage = () => {
  const { data, term } = useLoaderData();

  const [files, setFiles] = useState(data || []);
  const [fileShare, setFileShare] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (fileId) => {
    setIsDownloading(true);
    try {
      const response = await downloadFile(fileId);

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

  const handleDelete = async (id) => {
    try {
      await deleteFile(id);
      setFiles((prev) => prev.filter((value) => value.id !== id));
    } catch (error) {
      console.log(error);
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
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const menuOptions = [
    {
      label: (
        <div className="flex items-center gap-2">
          <HiEye /> View
        </div>
      ),
      onClick: (file) => {
        handlePreview(file);
      },
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <HiDownload /> Download
        </div>
      ),
      onClick: (file) => {
        handleDownload(file.id);
      },
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <HiShare /> Share
        </div>
      ),
      onClick: (file) => {
        setShowModal(true);
        setFileShare(file);
      },
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <HiTrash /> Delete
        </div>
      ),
      onClick: (file) => {
        handleDelete(file.id);
      },
    },
  ];

  const config = [
    {
      label: "Name",
      render: (file) => (
        <div className="flex gap-2 items-center">
          {file.isShare && <HiShare />} {file.originalFileName}
        </div>
      ),
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
    {
      label: "",
      render: (file) => (
        <FileMenu options={menuOptions} data={file}>
          <HiOutlineDotsHorizontal className="cursor-pointer" />
        </FileMenu>
      ),
    },
  ];

  const keyFn = (file) => file.id;

  return (
    <div className="w-full h-full flex flex-col">
      <p className="font-normal text-2xl mb-6">Search for "{term}"</p>
      {files.length > 0 ? (
        <Panel className="border-none rounded-lg p-3 overflow-visible">
          <Table data={files} config={config} keyFn={keyFn} />
        </Panel>
      ) : (
        <div className="w-full h-full flex justify-center items-center text-2xl  mb-30">
          Empty
        </div>
      )}

      {showModal && (
        <FileShareModal onClose={handleCloseModal} file={fileShare} />
      )}

      {showPreview && (
        <FilePreview file={filePreview} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};

export default SearchPage;
