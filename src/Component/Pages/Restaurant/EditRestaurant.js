import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import {
  ErrorMessage,
  SubmitButton,
  SuccessMessage,
} from "../../../helpers/common";
import { apiUrls } from "../../../utils/apiUrls";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { PostImage } from "../../../utils/apiCall";
import { PlushSvg, UploadImageSvg } from "../../../SvgFile/Index";
import { defaultConfig } from "../../../config";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { WithContext as ReactTags } from "react-tag-input";
export default function EditRestaurant({
  open,
  handleClose,
  handleSubmitApi,
  object,
  logoList,
  type,
  TagsListingData,
  mediaList,
}) {
  const [inputs, setInputs] = useState({
    status: "active",
    email: "",
    address: "",
    receiptAddress: "",
    restaurantNameAlias: [],
    tags: [],
  });
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState("");
  const simpleValidator = useRef(new SimpleReactValidator());
  const [menu, setMenu] = useState("");
  const [referencesItem, setReferencesItem] = useState([
    {
      imageId: "",
      imageLink: "",
    },
  ]);

  const [referencesmedia, setReferencesMedia] = useState([
    {
      mediaId: "",
      mediaLink: "",
    },
  ]);

  const [image, setImage] = useState("");
  const [, forceUpdate] = useState();
  const [loder, setLoader] = useState(false);
  const [address, setAddress] = useState("");
  const [latLong, setLatLong] = useState(object?.latLong);
  const suggestions =
    TagsListingData?.map((tag) => ({
      id: tag._id,
      text: tag.tag,
    })) || [];
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  const handleDelete = (i) => {
    const updatedTags = inputs.tags.filter((_, index) => index !== i);
    setInputs((prev) => ({ ...prev, tags: updatedTags }));
  };
  const handleAddition = (tag) => {
    const updatedTags = [...inputs.tags, tag?.text];
    setInputs((prev) => ({ ...prev, tags: updatedTags }));
  };

  const handleChangemap = (address) => {
    setAddress(address);
    setInputs((val) => ({ ...val, receiptAddress: address }));
  };

  const handleSelect = async (address) => {
    setInputs((val) => ({ ...val, city: "", state: "" }));
    const results = await geocodeByAddress(address);
    results[0].address_components.map((item) => {
      (item.types.find((attribute) => attribute === "locality") &&
        setInputs((val) => ({ ...val, state: item.long_name }))) ||
        (item.types.find(
          (attribute) => attribute === "administrative_area_level_1"
        ) &&
          setInputs((val) => ({ ...val, state: item.long_name })));
      (item.types.find((attribute) => attribute === "sublocality") &&
        setInputs((val) => ({ ...val, city: item.long_name }))) ||
        (item.types.find(
          (attribute) => attribute === "administrative_area_level_3"
        ) &&
          setInputs((val) => ({ ...val, city: item.long_name })));
      item.types.find((attribute) => attribute === "country") &&
        setInputs((val) => ({ ...val, country: item.long_name }));
      setInputs((val) => ({
        ...val,
        postalCode: item.types.find((attribute) => attribute === "postal_code")
          ? item.long_name
          : "",
      }));
    });

    setInputs((val) => ({
      ...val,
      receiptAddress: results[0].formatted_address,
    }));
    setAddress(results[0].formatted_address);
    const latLng = await getLatLng(results[0]);
    setLatLong({
      coordinates: [latLng.lng, latLng.lat],
      type: "Point",
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
      if (path?.length > 0) {
        setInputs((val) => {
          return { ...val, [name]: path[0] };
        });
        if (file) {
          setImage(e.target.files[0]);
        }
      } else {
        setInputs((val) => {
          return { ...val, [name]: "" };
        });
      }
      e.target.value = null;
    } else {
      ErrorMessage("Invalid file Format");
      setInputs((val) => {
        return { ...val, [name]: "" };
      });
      e.target.value = null;
      return false;
    }
  };

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setInputs((val) => ({ ...val, [name]: value }));
  };

  const Clear = () => {
    setInputs({
      name: "",
      email: "",
      stateCode: "",
      leaderBoardHeading: "",
      status: "active",
      phoneNo: "",
      receiptAddress: "",
      type: "",
      openingHours: "",
      description: "",
      address: "",
      restaurantNameAlias: [],
      tags: [],
    });
    setAddress("");
    setCompanyPhoneNumber("");
    setLatLong({
      coordinates: [0, 0],
      type: "Point",
    });
    setReferencesItem([
      {
        imageId: "",
        imageLink: "",
      },
    ]);
    setReferencesMedia([
      {
        mediaId: "",
        mediaLink: "",
      },
    ]);
    setImage("");
  };

  const handlecloses = () => {
    Clear();
    handleClose();
  };
  const Tagscreation = async (tags) => {
    try {
      const response = await callAPI(apiUrls.createTags, {}, "POST", {
        tag: tags,
      });
      if (!response?.data?.status) {
        ErrorMessage(response?.data?.message);
      }
    } catch (error) {
      setLoader(false);
      ErrorMessage(error?.message);
    }
  };

  const RegisterRestaurent = async () => {
    try {
      setLoader(true);
      delete inputs?.user_id;
      const apiResponse = await callAPI(
        apiUrls.restaurantUpdate + `/${object._id}`,
        {},
        "PUT",
        inputs
      );
      setLoader(false);
      if (apiResponse?.data?.status === true) {
        Clear();
        handleClose();
        Tagscreation(inputs?.tags);
        handleSubmitApi(inputs.type, type);
        SuccessMessage(apiResponse?.data?.message);
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      setLoader(false);
      ErrorMessage(error?.message);
    }
  };

  const handleSubmit = () => {
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      RegisterRestaurent();
    }
  };
  useEffect(() => {
    setInputs((val) => ({ ...val, latLong: latLong }));
  }, [latLong]);

  const addReferencesRow = () => {
    const updatedData = [
      ...referencesItem,
      {
        imageId: "",
        imageLink: "",
      },
    ];
    setReferencesItem(updatedData);
  };
  const addReferencesRowMedia = () => {
    const updatedData = [
      ...referencesmedia,
      {
        mediaId: "",
        mediaLink: "",
      },
    ];
    setReferencesMedia(updatedData);
  };

  const deleteReferencesRow = (deleteRow) => {
    const updatedEle = referencesItem.filter((val) => val !== deleteRow);
    setReferencesItem(updatedEle);
    setInputs((extra) => ({ ...extra, imageLogo: updatedEle }));
  };

  const deleteReferencesMediaRow = (deleteRow) => {
    const updatedEle = referencesmedia.filter((val) => val !== deleteRow);
    setReferencesMedia(updatedEle);
    setInputs((extra) => ({ ...extra, media: updatedEle }));
  };

  const handleChangeReferencesitem = (e, index) => {
    if (referencesItem !== undefined && referencesItem.length > 0) {
      let findlist = referencesItem.filter((curElem, i) => {
        if (i === index) {
          return curElem;
        }
      });

      if (findlist !== undefined) {
        let itemObj = findlist[0];
        let obj = { ...itemObj, [e.target.name]: e.target.value };
        let findindex = referencesItem.findIndex((elm, i) => {
          if (i === index) {
            return elm;
          }
        });

        referencesItem[findindex] = obj;
        setReferencesItem(referencesItem);
      }
    }
    setInputs((extra) => ({ ...extra, imageLogo: referencesItem }));
  };

  const handleChangeReferencesMediaitem = (e, index) => {
    if (referencesmedia !== undefined && referencesmedia.length > 0) {
      let findlist = referencesmedia.filter((curElem, i) => {
        if (i === index) {
          return curElem;
        }
      });

      if (findlist !== undefined) {
        let itemObj = findlist[0];
        let obj = { ...itemObj, [e.target.name]: e.target.value };
        let findindex = referencesmedia.findIndex((elm, i) => {
          if (i === index) {
            return elm;
          }
        });

        referencesmedia[findindex] = obj;
        setReferencesMedia(referencesmedia);
      }
    }
    setInputs((extra) => ({ ...extra, media: referencesmedia }));
  };

  useEffect(() => {
    if (object) {
      setMenu(object.name)
      setAddress(object?.receiptAddress);
      setLatLong(object?.latLong);
      if (object?.imageLogo?.length > 0) {
        setReferencesItem(object?.imageLogo);
      }
      if (object?.media?.length > 0) {
        setReferencesMedia(object?.media);
      }

      setCompanyPhoneNumber(object?.phoneNo);
      setInputs(object);
      setInputs((prev) => ({
        ...prev,
        ...object,
        restaurantNameAlias: object?.restaurantNameAlias || [],
        tags: object?.tags || [],
      }));
    }
  }, [object, open]);

  const handlePhonechange = (value, name) => {
    setCompanyPhoneNumber(value);
    setInputs((val) => {
      return { ...val, [name]: value };
    });
  };

  const handleValueChange = (name, value) => {
    setInputs((detail) => {
      return { ...detail, [name]: value };
    });
  };

  const addItem = () => {
    let itemList = inputs?.restaurantNameAlias;
    itemList.push("");
    handleValueChange("restaurantNameAlias", itemList);
  };
  const deleteItem = (index) => {
    let itemList = inputs.restaurantNameAlias;
    itemList.splice(index, 1);
    handleValueChange("restaurantNameAlias", itemList);
  };
  const itemValueChange = (values, index) => {
    let itemList = inputs.restaurantNameAlias;
    itemList[index] = values;
    handleValueChange("restaurantNameAlias", itemList);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handlecloses}
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
        aria-describedby="alert-dialog-description"
      >
        <div className="modal-dialog modal-dialog-centered model828">
          <div className="modal-content modelcustomstyle">
            <div className="modal-header p-0 border-bottom-0 position-relative justify-content-center">
              <div className="modelheading text-center">
                <h1 className="modal-title" id="exampleModalLabel">
                  Update {menu}
                </h1>
                <p>Please enter your restaurant details</p>
              </div>
              <button
                type="button"
                className="btn-close position-absolute top-50 end-0"
                onClick={handlecloses}
              />
            </div>
            <div className="modal-body px-0 py-4">
              <div className="uploadpicuser">
                <figure className="mb-2">
                  <img
                    src={
                      image
                        ? URL.createObjectURL(image)
                        : defaultConfig.imagePath + inputs?.profileImage
                    }
                    id="img-upload-tag"
                    className="img-fluid"
                    alt=""
                  />
                </figure>
                <div className="uplodtext d-flex align-items-center justify-content-center gap-2 position-relative">
                  <UploadImageSvg />
                  Update Logo
                  <input
                    type="file"
                    className="logoupload"
                    id="img-upload"
                    name="profileImage"
                    accept="image/png,image/jpg,image/jpeg"
                    onChange={(e) => {
                      UploadImage(e, ["image/png", "image/jpg", "image/jpeg"]);
                    }}
                  />
                </div>
              </div>
              <form className="formcontmodel mt-4">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Restaurant Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={inputs?.name}
                      name="name"
                      onChange={handleChange}
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "name",
                        inputs.name,
                        "required|max:100"
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={inputs?.email}
                      name="email"
                      onChange={handleChange}
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "email",
                        inputs.email,
                        "email"
                      )}
                    </div>
                  </div>
                  {/* ----------------- restaurant alias */}
                  <div className="col-lg-12 col-md-12 col-12">
                    <label htmlFor="">Restaurant Alias</label>
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
                      Add more Alias name
                    </div>
                  </div>

                  <div className="row">
                    {inputs?.restaurantNameAlias?.map((item, i) => {
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

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Phone No *</label>
                    <PhoneInput
                      country={"us"}
                      enableSearch={true}
                      value={companyPhoneNumber}
                      onChange={(phone) =>
                        handlePhonechange(`+${phone}`, "phoneNo")
                      }
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "phone",
                        inputs.phoneNo,
                        "required|max:15"
                      )}
                    </div>
                  </div>
                  {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Opening Time</label>
                    <input type="text" className="form-control" value={inputs?.openingHours} name='openingHours' onChange={handleChange} />

                  </div> */}
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Select Network</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={inputs?.type}
                      name="type"
                      onChange={handleChange}
                    // disabled={type !=="inNetwork"?false:true}
                    >
                      <option
                        value="outNetwork"
                        selected={inputs?.type === "outNetwork" ? true : false}
                      >
                        Out of Network
                      </option>
                      <option
                        value="inNetwork"
                        selected={inputs?.type === "inNetwork" ? true : false}
                      >
                        In Network
                      </option>
                    </select>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Leader Board Heading</label>
                    <input
                      type="text"
                      className="form-control"
                      value={inputs?.leaderBoardHeading ? inputs?.leaderBoardHeading : ""}
                      name="leaderBoardHeading"
                      onChange={handleChange}
                    />

                  </div>
                  <div className="col-lg-12 col-md-6 col-12 mb-3">
                    <label htmlFor="">Address *</label>
                    <PlacesAutocomplete
                      value={address}
                      onChange={handleChangemap}
                      onSelect={handleSelect}
                    >
                      {({
                        getInputProps,
                        suggestions,
                        getSuggestionItemProps,
                        loading,
                      }) => (
                        <div>
                          <input
                            {...getInputProps({ placeholder: "Type address" })}
                            className="form-control"
                          />
                          <div>
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion) => {
                              const style = {
                                backgroundColor: suggestion.active
                                  ? "#41b6e6"
                                  : "#fff",
                              };
                              return (
                                <div
                                  {...getSuggestionItemProps(suggestion, {
                                    style,
                                  })}
                                >
                                  {suggestion.description}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </PlacesAutocomplete>
                    <div className="error">
                      {simpleValidator.current.message(
                        "Address",
                        inputs.receiptAddress,
                        "required"
                      )}
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12 col-12 mb-3">
                    <label htmlFor="">Receipt Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={inputs?.address}
                      name="address"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4 col-md-4 col-12 mb-3">
                    <label htmlFor="">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={inputs?.city}
                      name="city"
                      onChange={handleChange}
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "city",
                        inputs.city,
                        "required"
                      )}
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-12 mb-3">
                    <label htmlFor="">State *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={inputs?.state}
                      name="state"
                      onChange={handleChange}
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "State",
                        inputs.state,
                        "required"
                      )}
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-12 mb-3">
                    <label htmlFor="">State Code*</label>
                    <input
                      type="text"
                      className="form-control"
                      value={inputs?.stateCode}
                      name="stateCode"
                      onChange={handleChange}
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "stateCode",
                        inputs.stateCode,
                        "required"
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-12 mb-3">
                    <label htmlFor="">Description</label>

                    <ReactQuill
                      theme="snow"
                      value={inputs?.description}
                      onChange={(value) => {
                        handleValueChange("description", value);
                      }}
                    />
                  </div>
                  <div className="col-lg-12 col-md-12 col-12 mb-3">
                    <label htmlFor="">Tags</label>
                    <ReactTags
                      tags={
                        Array.isArray(inputs.tags)
                          ? inputs.tags.map((text) => ({ id: text, text }))
                          : []
                      }
                      suggestions={suggestions}
                      handleDelete={handleDelete}
                      handleAddition={handleAddition}
                      delimiters={[KeyCodes.comma, KeyCodes.enter]}
                      placeholder="Type and press Enter..."
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-lg-12 col-md-12 col-12">
                      <div
                        className="addplateform d-flex align-items-center gap-2"
                        id="parentadd"
                      >
                        <figure className="mb-0" onClick={addReferencesRow}>
                          <PlushSvg />
                        </figure>
                        Other Ordering Platforms
                      </div>
                    </div>
                  </div>

                  {referencesItem?.map((elementInArray, index) => {
                    return (
                      <div className="row" id="childadd" key={index}>
                        <div className="col-lg-5 col-md-5 col-12 mb-3">
                          <label htmlFor="">Image</label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={(e) =>
                              handleChangeReferencesitem(e, index)
                            }
                            name="imageId"
                          >
                            <option value="">Select image</option>
                            {logoList?.map((val, i) => (
                              <option
                                key={i}
                                value={val._id}
                                selected={
                                  elementInArray?.imageId === val._id
                                    ? true
                                    : false
                                }
                              >
                                {val?.title}
                              </option>
                            ))}
                          </select>
                          <div className="error">
                            {simpleValidator.current.message(
                              "image",
                              elementInArray?.imageId,
                              "required"
                            )}
                          </div>
                        </div>
                        <div className="col-lg-5 col-md-5 col-12 mb-3">
                          <label htmlFor="">Upload LInk</label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={(e) =>
                              handleChangeReferencesitem(e, index)
                            }
                            name="imageLink"
                            value={elementInArray.imageLink}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "imageLink",
                              elementInArray?.imageLink,
                              "required"
                            )}
                          </div>
                        </div>
                        {index !== 0 && (
                          <div className="col-lg-1 col-md-1 col-12 mb-3 mt-4">
                            <i
                              onClick={(e) =>
                                deleteReferencesRow(elementInArray)
                              }
                              className="icofont-ui-delete"
                              style={{ cursor: "pointer", color: "red" }}
                            ></i>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="row mb-3">
                    <div className="col-lg-12 col-md-12 col-12">
                      <div
                        className="addplateform d-flex align-items-center gap-2"
                        id="parentadd"
                      >
                        <figure
                          className="mb-0"
                          onClick={addReferencesRowMedia}
                        >
                          <PlushSvg />
                        </figure>
                        Other Media Service
                      </div>
                    </div>
                  </div>

                  {referencesmedia?.map((elementInArray, index) => {
                    return (
                      <div className="row" id="childadd" key={index}>
                        <div className="col-lg-5 col-md-5 col-12 mb-3">
                          <label htmlFor="">Image</label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={(e) =>
                              handleChangeReferencesMediaitem(e, index)
                            }
                            name="mediaId"
                          >
                            <option value="">Select image</option>
                            {mediaList?.map((val, i) => (
                              <option
                                key={i}
                                value={val._id}
                                selected={
                                  elementInArray?.mediaId === val._id
                                    ? true
                                    : false
                                }
                              >
                                {val?.name}
                              </option>
                            ))}
                          </select>

                        </div>
                        <div className="col-lg-5 col-md-5 col-12 mb-3">
                          <label htmlFor="">Upload LInk</label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={(e) =>
                              handleChangeReferencesMediaitem(e, index)
                            }
                            name="mediaLink"
                            value={elementInArray?.mediaLink}
                          />

                        </div>
                        {index !== 0 && (
                          <div className="col-lg-1 col-md-1 col-12 mb-3 mt-4">
                            <i
                              onClick={(e) =>
                                deleteReferencesMediaRow(elementInArray)
                              }
                              className="icofont-ui-delete"
                              style={{ cursor: "pointer", color: "red" }}
                            ></i>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </form>
            </div>
            <div className="modal-footer p-0 border-top-0 justify-content-center gap-3">
              <button
                type="button"
                className="btndarkblue-outline modalfooterpadding"
                onClick={handlecloses}
              >
                Cancel
              </button>
              <SubmitButton
                text="Update"
                disabled={loder}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
