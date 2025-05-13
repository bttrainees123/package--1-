import React, { useEffect, useRef, useState } from "react";
import {
  ErrorMessage,
  SubmitButton,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import SimpleReactValidator from "simple-react-validator";
import Dialog from "@mui/material/Dialog";
import "react-phone-input-2/lib/bootstrap.css";
import { defaultConfig } from "../../../config";

export default function AddEditnfc({
  open,
  handleclose,
  LogoListAPI,
  action,
  object,
}) {
  const [value, setValue] = useState({
    url: defaultConfig.Appurl,
    status: "active",
    type: "nfc",
    restaurantId: "",
    label: "",
  });
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [logoList, setLogoList] = useState([]);
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
            ? apiUrls.urlCreate
            : apiUrls.urlEdit + `?urlId=${object._id}`,
          {},
          action === "add" ? "POST" : "POST",
          value
        );

        if (apiResponse?.data?.status === true) {
          SuccessMessage(apiResponse?.data?.message);
          await LogoListAPI();
          handleclose();
          simpleValidator.current.hideMessages();
          setValue({
            url: defaultConfig.Appurl,
            tag: "",
            type: "nfc",
            restaurantId: "",
            label: "",
          });
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
    if (action === "edit") {
      setValue({
        url: object.url,
        status: object.status,
        type: "nfc",
        restaurantId: object.restaurantId,
        label: object.label,
      });
      console.log("Value", value);

    } else
      setValue({
        url: defaultConfig.Appurl,
        status: "active",
        type: "nfc",
        restaurantId: "",
        label: "",
      });
  }, [object, action, open]);

  const handleCancel = () => {
    handleclose();
  };

  const RestaurantListAPI = async () => {
    try {
      const apiResponse = await callAPI(apiUrls.getRestaurantName, {}, "GET");
      if (apiResponse?.data?.status) {
        if (apiResponse?.data?.data?.length > 0) {
          setLogoList(apiResponse.data.data);
        } else {
          setLogoList([]);
        }
      }
    } catch (error) { }
  };

  useEffect(() => {
    RestaurantListAPI();
  }, [open]);

  useEffect(() => {
    if (value.restaurantId) {
      const cleanedLabel = value.label.toLowerCase().replace(/\s+/g, "");
      setValue((val) => ({
        ...val,
        url: `${defaultConfig.Appurl}${val.restaurantId}/nfc${cleanedLabel ? "/" + cleanedLabel : ""}`,
      }));
    }
  }, [value.restaurantId, value.label]);



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
                  Clone Restaurant
                </h1>
                <p>Please enter details</p>
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
                  <div className="col-lg-12 col-md-12 col-12 mb-3">
                    <label htmlFor="">Select Restaurant *</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={handleChange}
                      value={value.restaurantId}
                      name="restaurantId"
                    >
                      <option value="">Select</option>
                      {logoList?.map((val, i) => (
                        <option value={val._id} key={i}>{val.name}</option>
                      ))}


                    </select>
                    <div className="error">
                      {simpleValidator.current.message(
                        "restaurant name",
                        value?.restaurantId,
                        `required`
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-12 mb-3">
                    <label htmlFor="">Label</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter label"
                      onChange={handleChange}
                      value={value.label}
                      name="label"
                    />

                  </div>
                  <div className="col-lg-12 col-md-12 col-12 mb-3">
                    <label htmlFor="">Status</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={handleChange}
                      value={value.status}
                      name="status"
                    >
                      <option
                        value="active"
                        selected={value.status === "active"}
                      >
                        Active
                      </option>
                      <option
                        value="inactive"
                        selected={value.status === "inactive"}
                      >
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
                onClick={handleCancel}
              >
                Cancel
              </button>
              <SubmitButton
                text={"Save"}
                disabled={loader}
                onClick={Serviceadd}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
