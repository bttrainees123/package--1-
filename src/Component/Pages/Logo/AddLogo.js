import React, { useEffect, useRef, useState } from 'react'
import { PostImage } from '../../../utils/apiCall';
import { ErrorMessage, SubmitButton, SuccessMessage } from '../../../helpers/common';
import { callAPI } from '../../../utils/apiUtils';
import { apiUrls } from '../../../utils/apiUrls';
import SimpleReactValidator from "simple-react-validator";
import Dialog from "@mui/material/Dialog";
import { defaultConfig } from '../../../config';
import { UploadImageSvg } from '../../../SvgFile/Index';

export default function AddLogo({ open,
  handleclose,
  LogoListAPI,
  action,
  object, }) {
  const [value, setValue] = useState({
    image: "",
    status: "active",
    title: "",
  });
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [image, setImage] = useState('');
  const [, forceUpdate] = useState();
  const handleChange = (e) => {
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const UploadImage = async (e, allowedFileTypes) => {
    let file = e?.target?.files[0];
    let name = e?.target?.name;
    if (
      allowedFileTypes.includes(file?.type) ||
      allowedFileTypes.includes(file?.name?.split(".").reverse()[0])
    ) {
      const path = await PostImage(file);
      setImage(file)
      if (path?.length > 0) {
        setValue((val) => {

          return { ...val, [name]: path[0] };
        });
      } else {
        setValue((val) => {
          return { ...val, [name]: "" };
        });
      }
      e.target.value = null;
    } else {
      ErrorMessage("Invalid file Format");
      setValue((val) => {
        return { ...val, [name]: "" };
      });
      e.target.value = null;
      return false;
    }
  };

  const Serviceadd = async () => {
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        setLoader(true);
        const apiResponse = await callAPI(
          action === "add"
            ? apiUrls.Logocreate
            : apiUrls.logupdate + `/${object._id}`,
          {},
          action === "add"
            ? "POST"
            : "PUT",
          value
        );
        if (apiResponse?.data?.status === true) {
          SuccessMessage(apiResponse?.data?.message);
          await LogoListAPI();
          handleclose();
          setValue({ image: "", status: "active", title: "" });
          setImage('')
        } else {
          ErrorMessage(apiResponse?.data?.message);
        }
        setLoader(false);
      } catch (error) {
        setLoader(false);
        ErrorMessage(error?.message);
      }
    }
  };

  useEffect(() => {
    if (action == "edit") {
      setValue({
        title: object?.title,
        image: object?.image,
        status: object?.status,
      });
    } else setValue({ image: "", status: "active", title: "" });
  }, [object, action, open]);
  return (
    <>
      <Dialog
        open={open}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "666px",
              borderRadius: "30px",
              // Set your width here
            },
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <div className="modal-dialog modal-dialog-centered model828">
          <div className="modal-content modelcustomstyle">
            <div className="modal-header p-0 border-bottom-0 position-relative justify-content-center">
              <div className="modelheading text-center">
                <h1 className="modal-title" id="exampleModalLabel">
                  Add    {action === "add" ? "Add" : "Edit"} Logo
                </h1>
                <p>Please enter your logo details</p>
              </div>
              <button
                type="button"
                className="btn-close position-absolute top-50 end-0"
                onClick={handleclose}
              />
            </div>
            <div className="modal-body px-0 py-4">
              <div className="uploadpicuser">
                <figure className="mb-2">
                  <img
                    src={
                      image ? URL.createObjectURL(image)
                        : defaultConfig.imagePath + value?.image
                    }
                    id="img-upload-tag"
                    className="img-fluid"
                    alt=""
                  />
                </figure>
                <div className="uplodtext d-flex align-items-center justify-content-center gap-2 position-relative">
                  <UploadImageSvg />
                  Upload a Logo
                  <input type="file" className="logoupload" id="img-upload" name="image"
                    accept="image/png,image/jpg,image/jpeg"
                    onChange={(e) => {
                      UploadImage(e, [
                        "image/png",
                        "image/jpg",
                        "image/jpeg",
                      ]);
                    }} />
                </div>
              </div>
              <form className="formcontmodel mt-4">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor=""> Alternate Text *</label>
                    <input type="text" className="form-control" onChange={handleChange}
                      value={value.title}
                      name="title" placeholder='Enter Alternate Text' />
                    <div className="error">
                      {simpleValidator.current.message(
                        "alternate text",
                        value?.title,
                        `required|min:3`
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Status</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={handleChange}
                      value={value.status}
                      name="status">
                      <option
                        value="active"
                        selected={value.status === "active"}>
                        Active
                      </option>
                      <option
                        value="inactive"
                        selected={value.status === "inactive"}>
                        Inactive
                      </option>
                    </select>

                  </div>


                </div>
              </form>
            </div>
            <div className="modal-footer p-0 border-top-0 justify-content-center gap-3">
              <button
                type="button"
                className="btndarkblue-outline modalfooterpadding"
                onClick={handleclose}
              >
                Cancel
              </button>
              <SubmitButton
                text={action === "add" ? "Save" : "Update"}
                disabled={loader}
                onClick={Serviceadd}
              />

            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
