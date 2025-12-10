import React, { useState } from "react";
import Panel from "../components/Panel";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import {
  emptyTrash,
  getDeletedFiles,
  permanentDeleteFile,
  restoreFile,
} from "../services/fileService";
import { useLoaderData } from "react-router-dom";
import { IoReload } from "react-icons/io5";
import { TbTrashOff } from "react-icons/tb";
import FileMenu from "../components/FileMenu";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { formatFileSize } from "../utils/formatFileSize";
import { toast } from "react-toastify";

export const loader = async () => {
  try {
    const data = await getDeletedFiles();
    return data;
  } catch (error) {
    return null;
  }
};

const TrashPage = () => {
  const data = useLoaderData();

  const [files, setFiles] = useState(data || []);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleRestore = async (id) => {
    try {
      await restoreFile(id);
      setFiles((prev) => prev.filter((value) => value.id !== id));
      toast.success("Restore Successful");
    } catch (error) {}
  };

  const handlePermanentDelete = async (id) => {
    try {
      await permanentDeleteFile(id);
      setFiles((prev) => prev.filter((value) => value.id !== id));
      toast.success("Delete Successful");
    } catch (error) {}
  };

  const handleEmptyTrash = async () => {
    try {
      await emptyTrash();
      setFiles([]);
      setShowModal(false);
    } catch (error) {}
  };

  const actionBar = (
    <div className="flex justify-between w-full">
      <Button danger rounded onClick={handleEmptyTrash}>
        OK
      </Button>
      <Button primary rounded onClick={handleClose}>
        Cancel
      </Button>
    </div>
  );

  const menuOptions = [
    {
      label: (
        <div className="flex items-center gap-2">
          <IoReload />
          Restore
        </div>
      ),
      onClick: (file) => {
        handleRestore(file.id);
      },
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <TbTrashOff /> Delete
        </div>
      ),
      onClick: (file) => {
        handlePermanentDelete(file.id);
      },
    },
  ];

  const config = [
    {
      label: "Name",
      render: (file) => file.originalFileName,
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
        <FileMenu options={menuOptions} data={file}>
          <HiOutlineDotsHorizontal className="cursor-pointer" />
        </FileMenu>
      ),
    },
  ];

  const keyFn = (file) => file.id;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between">
        <div className="font-normal text-2xl mb-6">Trash</div>
        <Button
          primary
          rounded
          className="h-10"
          onClick={handleOpen}
          disabled={files.length <= 0}
        >
          Clear Trash
        </Button>
      </div>

      {files.length > 0 ? (
        <Panel className="border-none rounded-lg p-3 overflow-visible">
          <Table data={files} config={config} keyFn={keyFn} />
        </Panel>
      ) : (
        <div className="w-full h-full flex justify-center items-center text-2xl mb-30">
          Empty
        </div>
      )}

      {showModal && (
        <Modal
          onClose={handleClose}
          actionBar={actionBar}
          className="w-80 h-40"
        >
          <div className="text-2xl font-bold">Are you sure ?</div>
        </Modal>
      )}
    </div>
  );
};

export default TrashPage;
