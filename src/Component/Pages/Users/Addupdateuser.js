import React, { useEffect, useRef, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import SimpleReactValidator from 'simple-react-validator';
import { callAPI } from '../../../utils/apiUtils';
import { ErrorMessage, SubmitButton, SuccessMessage } from '../../../helpers/common';
import { apiUrls } from '../../../utils/apiUrls';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";


export default function Addupdateuser({ open,
  handleclose,
  handleSubmitApi,
  action,
  object }) {
  const [value, setValue] = useState({
    status: "active",
    name: "",
    // email:"",
    mobileno: ""
  });
  const [loader, setLoader] = useState(false);
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState('');
  const simpleValidator = useRef(new SimpleReactValidator());

  const [, forceUpdate] = useState();
  const handleChange = (e) => {
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
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
            ? apiUrls.updateUser
            : apiUrls.updateUser + `/${object._id}`,
          {},
          action === "add"
            ? "POST"
            : "PUT",
          value
        );
        if (apiResponse?.data?.status === true) {
          SuccessMessage(apiResponse?.data?.message);
          handleSubmitApi();
          handleclose();
          setValue({ status: "active", name: "", mobileno: "" });
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
        name: object?.name,
        status: object?.status,
        // email: object?.email,
        mobileno: object?.mobileno,
      });
      setCompanyPhoneNumber(object?.mobileno)
    } else setValue({ status: "active", name: "", mobileno: "" });
  }, [object, action, open]);

  const handlePhonechange = (value, name) => {
    setCompanyPhoneNumber(value)
    setValue((val) => {
      return { ...val, [name]: value };
    });
  };
  return (
    <>
      <Dialog
        open={open}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "666px",
              borderRadius: "30px"
              // Set your width here
            },
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="modal-dialog modal-dialog-centered model828">
          <div className="modal-content modelcustomstyle">
            <div className="modal-header p-0 border-bottom-0 position-relative justify-content-center">
              <div className="modelheading text-center">
                <h1 className="modal-title" id="exampleModalLabel">
                  {action === "add" ? "Add" : "Edit"} User
                </h1>
                <p>Please enter your User details</p>
              </div>
              <button
                type="button"
                className="btn-close position-absolute top-50 end-0"
                onClick={handleclose}
              />
            </div>
            <div className="modal-body px-0 py-4">
              <form className="formcontmodel mt-4">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Name *</label>
                    <input type="text" className="form-control" onChange={handleChange}
                      value={value.name}
                      name="name" />
                    <div className="error">
                      {simpleValidator.current.message(
                        "Name",
                        value?.name,
                        `required`
                      )}
                    </div>

                  </div>
                  {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
            <label htmlFor="">Email Address *</label>
            <input type="text" className="form-control"  onChange={handleChange}
                      value={value.email}
                      name="email"/>
            <div className="error">
                      {simpleValidator.current.message(
                        "Email",
                        value?.email,
                        `required|email`
                      )}
                    </div>
          </div> */}

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Phone No *</label>
                    <PhoneInput
                      country={"us"}
                      enableSearch={true}
                      value={companyPhoneNumber}
                      onChange={(phone) => handlePhonechange(`+${phone}`, "mobileno")}
                    />
                    <div className="error">{simpleValidator.current.message('phone', value.mobileno, 'required|max:15')}</div>
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
