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
import { PlushSvg } from "../../../SvgFile/Index";
export default function AddTag({ open, handleclose, LogoListAPI, action, object }) {
    const [value, setValue] = useState({
        tag: "",
        tagAlias: []
    });
    const [loader, setLoader] = useState(false);
    // const [inputs, setInputs] = useState({
    //     restaurantNameAlias: [],
    //     tags: [],
    // });
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
                        ? apiUrls.createTags
                        : apiUrls.editTag + `?tagId=${object._id}`,
                    {},
                    action === "add"
                        ? "POST"
                        : "POST",
                    value
                );
                console.log("apiResponse", apiResponse);
                if (apiResponse?.data?.status === true) {
                    SuccessMessage(apiResponse?.data?.message);
                    await LogoListAPI();
                    handleclose();
                    simpleValidator.current.hideMessages();
                    setValue({
                        tag: "",
                        tagAlias: []
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
                tag: object?.tag,
                tagAlias: object?.tagAlias || []
            });
        } else setValue({
            tag: "",
            tagAlias: []
        });
    }, [object, action, open]);
    const handleCancel = () => {
        handleclose();
    };

    const addItem = () => {
        console.log("Clicked");
        let itemList = value.tagAlias || [];
        itemList.push("");
        handleValueChange("tagAlias", itemList);
    };
    const deleteItem = (index) => {
        let itemList = value.tagAlias;
        itemList.splice(index, 1);
        handleValueChange("tagAlias", itemList);
    };
    const itemValueChange = (values, index) => {
        let itemList = value.tagAlias;
        itemList[index] = values;
        handleValueChange("tagAlias", itemList);
    };
    const handleValueChange = (name, value) => {
        setValue((detail) => {
            return { ...detail, [name]: value };
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
                                    Tag{" "}
                                </h1>
                                <p>Please enter Tag detail</p>
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
                                        <label htmlFor="">Tag Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            onChange={handleChange}
                                            value={value.tag}
                                            name="tag"
                                        />
                                        <div className="col-lg-12 col-md-12 col-12 mt-3">
                                            <label htmlFor="">Tag Alias</label>
                                            <div
                                                className="addplateform d-flex align-items-center gap-2"
                                                id="parentadd"
                                            >
                                                <figure
                                                    className="mb-0"
                                                    onClick={() => {
                                                        addItem();
                                                    }}
                                                >
                                                    <PlushSvg />
                                                </figure>
                                                Add more Tag Alias name
                                            </div>
                                        </div>
                                        <div className="row">
                                            {value.tagAlias.map((item, i) => {
                                                return (
                                                    <>
                                                        <div className="col-6 my-1" key={i}>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <input
                                                                    type="text"
                                                                    value={item}
                                                                    onChange={(e) => {
                                                                        itemValueChange(e.target.value, i);
                                                                    }}
                                                                    className="form-control formcontmodelinput "
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        deleteItem(i);
                                                                    }}
                                                                    type="button"
                                                                    className="rounded-circle mx-1 bg-danger text-white border border-danger"
                                                                >
                                                                    <i className="fa fa-times"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            })}
                                        </div>
                                        <div className="error">
                                            {simpleValidator.current.message(
                                                "tag",
                                                value?.tag,
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
