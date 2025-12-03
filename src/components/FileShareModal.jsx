import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { HiTrash } from "react-icons/hi";
import {
  getFilesShare,
  removeShareFile,
  shareFile,
} from "../services/fileShareService";
import { useRootContext } from "../pages/Root";

const FileShareModal = ({ onClose, file }) => {
  const { user } = useRootContext();

  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [url, setUrl] = useState("");

  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFilesShare(file.id);
      setUrl(data.shareUrl || "");
      setEmails(data.emails?.filter((value) => value !== user.email) || []);
    };

    fetchData();
  }, []);

  const handleAdd = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailErr("Invalid email!!!");
      return;
    } else {
      setEmailErr("");
    }
    if (emails.includes(email) || email === "") {
      return;
    }
    setEmails([...emails, email]);
    setEmail("");
  };

  const handleDelete = (emailToDelete) => {
    setEmails((prev) => prev.filter((value) => value !== emailToDelete));
  };

  const handleShare = async () => {
    if (emails.length <= 0) return;
    setIsSharing(true);
    await shareFile(file.id, { emails })
      .then((token) => {
        setUrl(token);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsSharing(false);
      });
  };

  const handleRemoveShare = async () => {
    const res = await removeShareFile(file.id)
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const actionBar = (
    <div>
      <Button primary rounded onClick={onClose}>
        Cancel
      </Button>
    </div>
  );

  const renderedEmails = emails.map((mail) => (
    <div
      key={mail}
      className="flex items-center px-2 gap-3 border border-gray-300 rounded-full h-8"
    >
      {mail}
      <HiTrash className="cursor-pointer" onClick={() => handleDelete(mail)} />
    </div>
  ));

  return (
    <Modal onClose={onClose} actionBar={actionBar} className="w-[50%] h-[55%]">
      <div className="text-xl">Share "{file.originalFileName}"</div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between gap-2">
          <input
            className="focus:outline-none w-[75%] px-3 border border-gray-300 rounded-lg"
            placeholder="Email..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button primary rounded onClick={handleAdd} className="w-[20%]">
            Add
          </Button>
        </div>
        {emailErr && <p className="text-red-500 text-sm">{emailErr}</p>}
      </div>

      <div className="flex flex-wrap p-2 gap-2 min-h-[30%] border border-gray-300 rounded-lg">
        {renderedEmails}
      </div>

      <div>Link share:</div>
      <div className="flex justify-between gap-2">
        <input
          className="focus:outline-none w-[70%] px-3 border border-gray-300 rounded-lg"
          value={url}
          readOnly
        />
        <div className="flex gap-3">
          <Button
            primary
            // disabled={file.share}
            rounded
            onClick={handleRemoveShare}
          >
            Remove
          </Button>
          <Button primary rounded loading={isSharing} onClick={handleShare}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FileShareModal;
