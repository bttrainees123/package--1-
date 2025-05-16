import React, { useEffect, useRef, useState } from "react";
import { PostImage } from "../../../utils/apiCall";
import {
    ErrorMessage,
    SubmitButton,
    SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import SimpleReactValidator from "simple-react-validator";
import Dialog from "@mui/material/Dialog";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

export default function CreateNotificationAlert({
    open,
    handleclose,
    LogoListAPI,
    action,
    object,
}) {
    const [value, setValue] = useState({
        phoneNumber: "",
        message: "",
    });
    const [loader, setLoader] = useState(false);
    const [companyPhoneNumber, setCompanyPhoneNumber] = useState("");
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
                        ? apiUrls.createNotificationAlert
                        : apiUrls.UpdateNotificationAlert + `?notificationId=${object._id}`,
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
                        phoneNumber: "",
                        message: "",
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

    const handlePhonechange = (value, name) => {
        setCompanyPhoneNumber(value);
        setValue((val) => {
            return { ...val, [name]: value };
        });
    };

    useEffect(() => {
        if (action == "edit") {
            setValue({
                phoneNumber: object?.phoneNumber,
                message: object?.message,
            });
            setCompanyPhoneNumber(object?.phoneNumber);
        } else {
            setCompanyPhoneNumber("");
            setValue({
                phoneNumber: "",
                message: "",
            });
        }
    }, [object, action, open]);

    const handleCancel = () => {
        handleclose()
    }
    
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
                                    {action === "add" ? "Add" : "Edit"} Alert Message
                                </h1>
                                <p>Please enter alert message detail</p>
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
                                        <label htmlFor="">Phone Number *</label>
                                        <PhoneInput
                                            country={"us"}
                                            enableSearch={true}
                                            value={companyPhoneNumber}
                                            onChange={(phone) =>
                                                handlePhonechange(`+${phone}`, "phoneNumber")
                                            }
                                        />
                                        <div className="error">
                                            {simpleValidator.current.message(
                                                "Phone Number",
                                                value?.phoneNumber,
                                                `required|max:15`
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-12 mb-3">
                                        <label htmlFor="">Message *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            onChange={handleChange}
                                            value={value.message}
                                            name="message"
                                        />
                                        <div className="error">
                                            {simpleValidator.current.message(
                                                "message",
                                                value?.message,
                                                `required`
                                            )}
                                        </div>
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
                                text={action === "add" ? "Save" : "Update"}
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
