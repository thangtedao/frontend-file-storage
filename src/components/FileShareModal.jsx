import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { HiTrash } from "react-icons/hi";
import {
  getPublicLinkInfo,
  removeShareFile,
  shareFile,
  updateShareFile,
  shareFilePublicly,
  removePublicLink,
  getFileShareInfo,
} from "../services/fileShareService";
import { checkEmail } from "../services/authService";
import { useRootContext } from "../pages/Root";
import { AiFillSwitcher } from "react-icons/ai";

const FileShareModal = ({ onClose, file }) => {
  const { user } = useRootContext();

  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [url, setUrl] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const [selected, setSelected] = useState("user");

  const options = [
    { value: "user", label: "Share with user" },
    { value: "public", label: "Public share" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFileShareInfo(file.id);
      const url = await getPublicLinkInfo(file.id);
      const listEmail = data.map((f) => f.sharedEmail);
      setEmails(listEmail || []);
      setUrl(url || null);
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
      return;
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
    onClose();
  };

  //Share with user
  const shareWithUser = async () => {
    setIsSharing(true);
    const request = emails.map((e) => ({ email: e }));
    if (emails.length > 0 || url) {
      await updateShareFile(file.id, request)
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsSharing(false);
        });
    } else {
      await shareFile(file.id, request)
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsSharing(false);
        });
    }
  };

  //Share public
  const sharePublic = async () => {
    setIsSharing(true);
    const link = await shareFilePublicly(file.id);
    if (link) {
      setUrl(link);
    }
    setIsSharing(false);
  };

  //Remove public link
  const handleRemovePublicShare = async () => {
    setIsSharing(true);
    await removePublicLink(url?.id)
      .then(() => {
        // onClose();
      })
      .catch((error) => {
        console.log(error);
      });
    setUrl(null);
    setIsSharing(false);
  };

  //Remove share
  const handleRemoveShare = async () => {
    setIsSharing(true);
    await removeShareFile(file?.id)
      .then(() => {
        // onClose();
      })
      .catch((error) => {
        console.log(error);
      });
    setEmails([]);
    setIsSharing(false);
  };

  const actionBar = (
    <div className="flex gap-3">
      {selected === "user" && (
        <Button
          secondary
          rounded
          loading={isSharing}
          disabled={emails.length <= 0}
          onClick={handleRemoveShare}
        >
          Remove Share
        </Button>
      )}
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
                  className="focus:outline-none flex-1 px-3 border border-gray-300 rounded-lg"
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
            <div className="flex justify-between gap-3">
              <input
                className="focus:outline-none flex-1 px-3 border border-gray-300 rounded-lg"
                value={
                  url?.token ? `localhost:5173/file/${url?.token}/share` : ""
                }
                readOnly
              />
              <div className="flex">
                {url ? (
                  <Button
                    primary
                    loading={isSharing}
                    rounded
                    onClick={() => handleRemovePublicShare()}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    primary
                    loading={isSharing}
                    rounded
                    onClick={() => sharePublic()}
                  >
                    Get Link
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FileShareModal;
