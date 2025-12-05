import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { HiTrash } from "react-icons/hi";
import {
  getFilesShare,
  removeShareFile,
  shareFile,
  shareFilePublicly,
} from "../services/fileShareService";
import { checkEmail } from "../services/authService";
import { useRootContext } from "../pages/Root";
import { AiFillSwitcher } from "react-icons/ai";

const FileShareModal = ({ onClose, file }) => {
  const { user } = useRootContext();

  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [url, setUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const [selected, setSelected] = useState("user");

  const options = [
    { value: "user", label: "Share with user" },
    { value: "public", label: "Public share" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFilesShare(file.id);
      setUrl(data.shareUrl || "");
      setEmails(data.emails?.filter((value) => value !== user.email) || []);
    };

    fetchData();
  }, []);

  //Add email to share
  const handleAdd = async () => {
    setIsAdding(true);
    checkValidEmail();
    setIsAdding(false);
  };

  const checkValidEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailErr("Invalid email!!!");
    }

    if (email === user?.email) {
      setEmailErr("Invalid email!!!");
      return;
    }

    const isValid = await checkEmail(email);
    if (!isValid) {
      setEmailErr("Invalid email!!!");
    } else {
      setEmailErr("");
      if (emails.includes(email) || email === "") {
        setEmail("");
        return;
      }
      setEmails([...emails, email]);
      setEmail("");
    }
  };

  // Remove email
  const handleDelete = (emailToDelete) => {
    setEmails((prev) => prev.filter((value) => value !== emailToDelete));
  };

  const handleShare = async () => {
    if (selected === "user") {
      shareWithUser();
    }
  };

  //Share with user
  const shareWithUser = async () => {
    if (emails.length <= 0) return;
    setIsSharing(true);
    await shareFile(file.id, { emails })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsSharing(false);
      });
  };

  //Share public
  const sharePublic = async () => {
    setIsSharing(true);
    const res = await shareFilePublicly(file.id);
    if (res?.data) {
      setUrl(res.data);
    }
    setIsSharing(false);
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
    <div className="flex gap-3">
      <Button primary rounded loading={isSharing} onClick={handleShare}>
        Save
      </Button>
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
      <div className="h-full flex flex-col gap-2">
        <div className="text-xl">Share "{file.originalFileName}"</div>

        <div className="flex gap-1">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition"
            >
              <input
                type="radio"
                name="example"
                value={option.value}
                checked={selected === option.value}
                onChange={(e) => setSelected(e.target.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />

              <span className="text-gray-800">{option.label}</span>
            </label>
          ))}
        </div>

        {selected === "user" ? (
          <div className="h-full flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between gap-2">
                <input
                  className="focus:outline-none w-[75%] px-3 border border-gray-300 rounded-lg"
                  placeholder="Email..."
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Button
                  primary
                  rounded
                  loading={isAdding}
                  onClick={handleAdd}
                  className="w-[20%]"
                >
                  Add
                </Button>
              </div>
              {emailErr && <p className="text-red-500 text-sm">{emailErr}</p>}
            </div>

            <div className="flex flex-wrap p-2 gap-2 min-h-[70%] border border-gray-300 rounded-lg">
              {renderedEmails}
            </div>
          </div>
        ) : (
          <div className="h-full">
            <div>Public Link:</div>
            <div className="flex justify-between gap-2">
              <input
                className="focus:outline-none w-[70%] px-3 border border-gray-300 rounded-lg"
                value={url}
                readOnly
              />
              <div className="flex gap-3">
                <Button
                  primary
                  disabled={isSharing}
                  rounded
                  onClick={sharePublic}
                >
                  Get Link
                </Button>
                {/* <Button
                  primary
                  // disabled={file.share}
                  rounded
                  onClick={handleRemoveShare}
                >
                  Remove
                </Button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FileShareModal;
