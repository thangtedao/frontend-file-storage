import classNames from "classnames";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const Modal = ({ onClose, children, actionBar, className }) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const classes = classNames(
    className,
    "rounded-lg p-10 bg-white min-w-80 min-h-50 z-99"
  );

  return ReactDOM.createPortal(
    <div className=" fixed inset-0 flex justify-center items-center">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-500 opacity-30"
      ></div>
      <div className={classes}>
        <div className="flex flex-col justify-between h-full">
          {children}
          <div className="flex justify-end">{actionBar}</div>
        </div>
      </div>
    </div>,
    document.querySelector(".modal-container")
  );
};

export default Modal;
