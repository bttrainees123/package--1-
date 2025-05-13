import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog } from "@mui/material";
import { Link } from "react-router-dom";

const HandleDelete = ({
  isOpen,
  handleClose,
  handleDelete,
  deleteTitle,
  loder,
}) => {
  return (
    <>
      <Dialog
        open={isOpen}
        fullWidth={true}
        maxWidth={"xs"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="modal-dialog modal-dialog-centered model472">
          <div className="modal-content modelcustomstyle">
            <div className="modal-header p-0 border-bottom-0 position-relative justify-content-center"></div>
            <div className="modal-body px-0 py-0">
              <figure className="logout mb-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  id="sign-out-alt"
                >
                  <path
                    fill="#6563FF"
                    d="M12.59,13l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-4-4a1,1,0,1,0-1.42,1.42L12.59,11H3a1,1,0,0,0,0,2ZM12,2A10,10,0,0,0,3,7.55a1,1,0,0,0,1.8.9A8,8,0,1,1,12,20a7.93,7.93,0,0,1-7.16-4.45,1,1,0,0,0-1.8.9A10,10,0,1,0,12,2Z"
                  ></path>
                </svg>
              </figure>
              <div className="modelheading text-center mt-3 mb-4">
                <h1 className="modal-title" id="exampleModalLabel">
                  Delete
                </h1>
                <p>{deleteTitle} ?</p>
              </div>
            </div>
            <div className="modal-footer p-0 border-top-0 justify-content-center gap-3">
              <button
                disabled={loder}
                type="button"
                onClick={handleDelete}
                className="btndarkblue modalfooterpadding"
              >
                Yes
                {loder && (
                  <i
                    className="fa fa-spinner fa-spin"
                    style={{ marginLeft: "10px" }}
                  ></i>
                )}
              </button>

              <button
                type="button"
                className="btndarkblue-outline modalfooterpadding"
                onClick={handleClose}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};



function CapitalizeLetter(string) {
  return string?.toUpperCase();
}

function debounce(method, pageNo, rowsPerPage, searchQuery, filterQuery) {
  const timer = setTimeout(() => {
    method(pageNo, rowsPerPage, searchQuery, filterQuery);
  }, 500);
  return () => {
    clearTimeout(timer);
  };
}

const ApiLoder = () => {
  return (
    <>
      <div className="spinner_overlay"></div>
      <div className="spinner-box">
        <img src="/image/loder.gif" alt="" className="loading-icon" />
      </div>
    </>
  );
};

export const trimText = (value, size) => {
  let str = "";
  if (value && value.length > size) {
    if (value[size - 1] == " ") str = value.slice(0, size - 1) + "...";
    else str = value.slice(0, size) + "...";
  }
  return str;
};

const SeeMore = ({ value, size }) => {
  const [show, setShow] = useState(false);
  return value?.length > size ? (
    <>
      {show ? value : trimText(value, size)}
      <span
        style={{ fontWeight: "bold", cursor: "pointer" }}
        onClick={() => {
          setShow(!show);
        }}
      >
        {show ? " see less" : " see more"}
      </span>
    </>
  ) : (
    value
  );
};

const SuccessMessage = (message) => {
  setTimeout(
    () =>
      toast.success(message, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }),
    10
  );
};

const ErrorMessage = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 2000,
    theme: "colored",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const acceptImageType = "image/png,image/jpg,image/jpeg";
const imageType = ["image/png", "image/jpg", "image/jpeg"];
const acceptDocOrPdfType = ".doc,.pdf";
const docOrPdfType = ["doc", "pdf"];
const acceptFileType =
  "image/png,image/jpg,image/jpeg,.doc, .docx,.xls,.xlsx,.pdf,.csv,";
const fileType = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "pdf",
  "csv",
  "jpg",
  "png",
  "jpeg",
];
const acceptVideoType = "mp4";
const videoType = ["mp4"];

function CapitalizeFirstLatter(s) {
  return s[0].toUpperCase() + s.slice(1);
}

function cleanObject(obj) {
  for (const key in obj) {
    if (obj[key] === "") {
      delete obj[key]; // Remove empty string
    } else if (Array.isArray(obj[key]) && obj[key].length === 0) {
      delete obj[key]; // Remove empty array
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      cleanObject(obj[key]); // Recursively clean nested objects
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]; // Remove empty object
      }
    }
  }
  return obj;
}

function SubmitButton({ onClick, disabled, text }) {
  return (
    <button
      disabled={disabled}
      type="button"
      onClick={onClick}
      className="btndarkblue modalfooterpadding"
    >
      {text}
      {disabled && <i className="fa fa-spinner fa-spin"></i>}
    </button>
  );
}

function InputFeild(props) {
  return (
    <>
      <label htmlFor={props.name} className={props.labelclassName}>
        {props.label}
      </label>
      <input
        type={props.type}
        className={props.className}
        name={props.name}
        id={props.name}
        placeholder={props.placeholder}
        value={props.value || ""}
        onChange={props.handelChange}
      />
    </>
  );
}

function Button({ disabled, text, className, type }) {
  return (
    <button
      disabled={disabled}
      type={type}
      className={className}
    >
      {text}
    </button>
  );
}

function Breadcrumb({ title, subtitle, childrenTitle, link }) {
  return (
    <div className="top-title-sec d-flex align-items-center justify-content-between mb-30">
      <h1 className="heading24 mb-0">{title}</h1>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-0 custbread">
          <li className="breadcrumb-item">
            <Link to={link}>{subtitle}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {childrenTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
}

export {
  ApiLoder,
  debounce,
  SeeMore,
  HandleDelete,
  ErrorMessage,
  SuccessMessage,
  CapitalizeLetter,
  acceptImageType,
  imageType,
  acceptFileType,
  fileType,
  acceptVideoType,
  videoType,
  acceptDocOrPdfType,
  docOrPdfType,
  CapitalizeFirstLatter,
  InputFeild,
  cleanObject,
  SubmitButton,
  Button,
  Breadcrumb
};
