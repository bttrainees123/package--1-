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
export default function AddEditUrl({ open, handleclose, LogoListAPI, action, object }) {
    const [value, setValue] = useState({
        url: "",
        status: "active",
        type: "other"
    });
    const [loader, setLoader] = useState(false);
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
                        ? apiUrls.urlCreate
                        : apiUrls.urlEdit + `?urlId=${object._id}`,
                    {},
                    action === "add"
                        ? "POST"
                        : "POST",
                    value
                );

                if (apiResponse?.data?.status === true) {
                    SuccessMessage(apiResponse?.data?.message);
                    await LogoListAPI();
                    handleclose();
                    simpleValidator.current.hideMessages();
                    setValue({
                        tag: "",
                        type: "other"
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
                type: "other"

            });
        } else setValue({
            url: "",
            status: "active",
            type: "other"
        });
    }, [object, action, open]);
    const handleCancel = () => {
        handleclose();
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
                                    URL{" "}
                                </h1>
                                <p>Please enter Url</p>
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
                                        <label htmlFor="">Url *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Url"
                                            onChange={handleChange}
                                            value={value.url}
                                            name="url"
                                        />
                                        <div className="error">
                                            {simpleValidator.current.message(
                                                "url",
                                                value?.url,
                                                `required`
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-12 mb-3">
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
