import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import { PostImage, PostImageMultiple } from "../../../utils/apiCall";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { defaultConfig } from "../../../config";

export default function Index() {
  const [selectedRestaurantOption, setSelectedRestaurantOption] = useState("");
  const [selectedAddressOption, setSelectedAddressOption] = useState("");
  const [selectedMenuOption, setSelectedMenuOption] = useState([])
  const [selectedMenuAddressOption, setSelectedMenuAddressOption] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pathArr, setPathArr] = useState([])
  const [imgArr, setImgArr] = useState([])
  const [parseData, setParseData] = useState([])
  const [menuValue, setMenuValue] = useState([{
    parsedData: "",
    nameStartWith: '',
    nameEndWith: '',
    namestartFrom: '',
    nameendFrom: '',
    namelineNumber: '',
    descriptionStartWith: '',
    descriptionEndWith: '',
    descriptionstartFrom: '',
    descriptionendFrom: '',
    descriptionlineNumber: ''
  }])

  const [value, setValue] = useState({
    parsedData: "",
    nameStartWith: "",
    nameEndWith: "",
    namestartFrom: "",
    nameendFrom: "",
    namelineNumber: "",
    addressStartWith: "",
    addressEndWith: "",
    addressstartFrom: "",
    addressendFrom: "",
    addresslineNumber: "",
  });

  const [input, seInput] = useState({
    restaurantAddress: "",
    restaurantName: ""
  });

  const [menuInput, setMenuInput] = useState([
    {
      itemName: "",
      description: ""
    },
  ])

  const handleMultipleMenu = async (e) => {
    const files = Array.from(e.target.files);
    const updatedImgArr = [...imgArr, ...files];
    setImgArr(updatedImgArr);
    const path = await PostImageMultiple(updatedImgArr);
    pathArr.push(...path);
    setPathArr(pathArr);
    console.log("pathArr ", pathArr);
    if (path?.length > 0) handleMultiplePath(path);
    e.target.value = null;
  };

  const handleMenuValueChange = (index, event) => {
    const { name, value } = event.target;
    const updatedValues = [...menuValue];
    updatedValues[index] = { ...updatedValues[index], [name]: value };
    setMenuValue(updatedValues);
  };

  const ParseMenuData = async (index) => {
    const hasValue = Object.values(menuValue[index]).some((val) => val.trim() !== "");
    if (!hasValue) return;
    try {
      setLoader(true);
      const data = { parsedData: parseData[index] };
      const menuOpt = selectedMenuOption[index];
      if (menuOpt) {
        if (menuOpt === "startWith") data.nameStartWith = menuValue[index].nameStartWith;
        else if (menuOpt === "endWith") data.nameEndWith = menuValue[index].nameEndWith;
        else if (menuOpt === "between") {
          data.namestartFrom = menuValue[index].namestartFrom;
          data.nameendFrom = menuValue[index].nameendFrom;
        } else if (menuOpt === "chef") data.namelineNumber = menuValue[index].namelineNumber;
      }
      const descriptionOpt = selectedMenuAddressOption[index];
      if (descriptionOpt) {
        if (descriptionOpt === "startWith") data.descriptionStartWith = menuValue[index].descriptionStartWith;
        else if (descriptionOpt === "endWith") data.descriptionEndWith = menuValue[index].descriptionEndWith;
        else if (descriptionOpt === "between") {
          data.descriptionstartFrom = menuValue[index].descriptionstartFrom;
          data.descriptionendFrom = menuValue[index].descriptionendFrom;
        } else if (descriptionOpt === "chef") data.descriptionlineNumber = menuValue[index].descriptionlineNumber;
      }
      const apiResponse = await callAPI(apiUrls.menuParser, {}, "POST", data);
      if (apiResponse?.data?.status) {
        console.log("apiResponse ", apiResponse);
        const updatedInputs = [...menuInput];
        updatedInputs[index] = {
          ...updatedInputs[index],
          itemName: apiResponse?.data?.data?.menuName,
          description: apiResponse?.data?.data?.menuDescription,
        };
        setMenuInput(updatedInputs);
        console.log("Menu value ", menuInput)
        SuccessMessage(apiResponse?.data?.message);
      } else {
        ErrorMessage(apiResponse?.data?.message);
        const resetInputs = [...menuInput];
        resetInputs[index] = { itemName: "", description: "" };
        setMenuInput(resetInputs);
      }
      setLoader(false);
    } catch (error) {
      const resetInputs = [...menuInput];
      resetInputs[index] = { itemName: "", description: "" };
      setMenuInput(resetInputs);
      setLoader(false);
      ErrorMessage(error?.message);
    }
  };

  const handleMultiplePath = async (path) => {
    try {
      setLoader(true);
      const apiResponse = await callAPI(apiUrls.reciptMenuParserAdmin, {}, "POST", { images: path })
      console.log("apiResponse ", apiResponse)
      if (apiResponse?.data?.status) {
        setParseData((prev) => [...prev, ...apiResponse?.data?.data]);
        console.log("ParseData ", parseData);
        setImgArr([])
        SuccessMessage(apiResponse?.data?.message);
      } else {
        ErrorMessage(apiResponse?.data?.message);
      } setLoader(false);
    } catch (error) {
      setLoader(false);
      ErrorMessage(error?.message);
    }
  }

  const UploadImage = async (e, allowedFileTypes) => {
    let file = e?.target?.files[0];
    if (
      allowedFileTypes.includes(file?.type) ||
      allowedFileTypes.includes(file?.name?.split(".").reverse()[0])
    ) {
      const path = await PostImage(file);
      if (path?.length > 0) {
        Serviceadd(path[0]);
      }
      e.target.value = null;
    } else {
      ErrorMessage("Invalid file Format");

      e.target.value = null;
      return false;
    }
  };

  const Serviceadd = async (image) => {
    try {
      setLoader(true);
      const apiResponse = await callAPI(
        apiUrls.reciptRestaurantMenu,
        {},
        "POST",
        { image: image }
      );
      if (apiResponse?.data?.status) {
        setValue((val) => {
          return { ...val, parsedData: apiResponse?.data?.data };
        });
        SuccessMessage(apiResponse?.data?.message);
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      ErrorMessage(error?.message);
    }
  };

  const ParseName = async () => {
    const hasValue = Object.values(value).some((val) => val.trim() !== "");
    if (!hasValue) return;
    try {
      setLoader(true);
      let data = {
        parsedData: value.parsedData,
      };
      if (selectedRestaurantOption) {
        if (selectedRestaurantOption === "startWith") {
          data.nameStartWith = value.nameStartWith;
        } else if (selectedRestaurantOption === "endWith") {
          data.nameEndWith = value.nameEndWith;
        } else if (selectedRestaurantOption === "between") {
          data.namestartFrom = value.namestartFrom;
          data.nameendFrom = value.nameendFrom;
        } else if (selectedRestaurantOption === "chef") {
          data.namelineNumber = value.namelineNumber;
        }
      }

      if (selectedAddressOption) {
        if (selectedAddressOption === "startWith") {
          data.addressStartWith = value.addressStartWith;
        } else if (selectedAddressOption === "endWith") {
          data.addressEndWith = value.addressEndWith;
        } else if (selectedAddressOption === "between") {
          data.addressstartFrom = value.addressstartFrom;
          data.addressendFrom = value.addressendFrom;
        } else if (selectedAddressOption === "chef") {
          data.addresslineNumber = value.addresslineNumber;
        }
      }

      const apiResponse = await callAPI(
        apiUrls.restaurantParser,
        {},
        "POST",
        data
      );
      if (apiResponse?.data?.status) {
        seInput((val) => {
          return { ...val, restaurantAddress: apiResponse?.data?.data.restaurantAddress, restaurantName: apiResponse?.data?.data.restaurantName };
        });
      } else {
        ErrorMessage(apiResponse?.data?.message);
        seInput((val) => {
          return { ...val, restaurantAddress: "", restaurantName: "" };
        });
      }
      setLoader(false);
    } catch (error) {
      seInput((val) => {
        return { ...val, restaurantAddress: "", restaurantName: "" };
      });
      setLoader(false);
      ErrorMessage(error?.message);
    }
  };

  const labels = {
    startWith: "Start With",
    endWith: "End With",
    between: "Between",
    chef: "Line Number",
  };

  const renderInputField = (selectedOption, type) => {
    if (!selectedOption) return null;
    // Determine key prefix based on type (name or address)
    const prefix = type === "name" ? "name" : "address";
    if (selectedOption === "chef") {
      const fieldName = prefix + "lineNumber";
      return (
        <div className="form-group">
          <h6>{labels[selectedOption]}</h6>
          <input
            type="text"
            className="form-control"
            placeholder="Start From"
            value={value[fieldName]}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, [fieldName]: e.target.value }))
            }
          />
        </div>
      );
    } else if (selectedOption === "between") {
      const startField = prefix + "startFrom";
      const endField = prefix + "endFrom";
      return (
        <>
          <div className="form-group mb-3">
            <h6>Start From</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Start From"
              value={value[startField]}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, [startField]: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <h6>End From</h6>
            <input
              type="text"
              className="form-control"
              placeholder="End From"
              value={value[endField]}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, [endField]: e.target.value }))
              }
            />
          </div>
        </>
      );
    } else {
      const fieldName =
        prefix +
        selectedOption.charAt(0).toUpperCase() +
        selectedOption.slice(1);
      return (
        <div className="form-group">
          <h6>{labels[selectedOption]}</h6>
          <input
            type="text"
            className="form-control"
            placeholder={`Enter ${labels[selectedOption]}`}
            value={value[fieldName]}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, [fieldName]: e.target.value }))
            }
          />
        </div>
      );
    }
  };

  const renderInputFieldMenu = (selectedOption, type, index) => {
    const value = menuValue[index] || {};
    if (type === "name") {
      if (selectedOption === "startWith") {
        return (
          <div className="form-group">
            <h6>Start With</h6>
            <input
              className="form-control"
              type="text"
              name="nameStartWith"
              value={value.nameStartWith || ""}
              onChange={(e) => handleMenuValueChange(index, e)}
              placeholder="Enter start with"
            />
          </div>
        );
      } else if (selectedOption === "endWith") {
        return (
          <div className="form-group">
            <h6>End With</h6>
            <input
              className="form-control"
              type="text"
              name="nameEndWith"
              value={value.nameEndWith || ""}
              onChange={(e) => handleMenuValueChange(index, e)}
              placeholder="Enter end with"
            />
          </div>
        );
      } else if (selectedOption === "between") {
        return (
          <>
            <div className="form-group">
              <h6>start From</h6>
              <input
                className="form-control mb-1"
                type="text"
                name="namestartFrom"
                value={value.namestartFrom || ""}
                onChange={(e) => handleMenuValueChange(index, e)}
                placeholder="Enter start from"
              />
            </div>
            <div className="form-group">
              <h6>End From</h6>
              <input
                className="form-control"
                type="text"
                name="nameendFrom"
                value={value.nameendFrom || ""}
                onChange={(e) => handleMenuValueChange(index, e)}
                placeholder="Enter end from"
              />
            </div>
          </>
        );
      } else if (selectedOption === "chef") {
        return (
          <div className="form-group">
            <h6>Line Number</h6>
            <input
              className="form-control"
              type="number"

              name="namelineNumber"
              value={value.namelineNumber || ""}
              onChange={(e) => handleMenuValueChange(index, e)}
              placeholder="Line number"
            />
          </div>
        );
      }
    } else if (type === "address") {
      if (selectedOption === "startWith") {
        return (
          <div className="form-group">
            <h6>Start With</h6>
            <input
              className="form-control"
              type="text"
              name="descriptionStartWith"
              value={value.descriptionStartWith || ""}
              onChange={(e) => handleMenuValueChange(index, e)}
              placeholder="Start With"
            />
          </div>
        );
      } else if (selectedOption === "endWith") {
        return (
          <div className="form-group">
            <h6>End With</h6>
            <input
              className="form-control"
              type="text"
              name="descriptionEndWith"
              value={value.descriptionEndWith || ""}
              onChange={(e) => handleMenuValueChange(index, e)}
              placeholder="Enter end with"
            />
          </div>
        );
      } else if (selectedOption === "between") {
        return (
          <>
            <div className="form-group">
              <h6>Start From</h6>
              <input
                className="form-control mb-1"
                type="text"
                name="descriptionstartFrom"
                value={value.descriptionstartFrom || ""}
                onChange={(e) => handleMenuValueChange(index, e)}
                placeholder="Enter start from"
              />
            </div>
            <div className="form-group">
              <h6>End From</h6>
              <input
                className="form-control"
                type="text"
                name="descriptionendFrom"
                value={value.descriptionendFrom || ""}
                onChange={(e) => handleMenuValueChange(index, e)}
                placeholder="Enter end from"
              />
            </div>
          </>
        )
      } else if (selectedOption === "chef") {
        return (
          <div className="form-group">
            <h6>Line Number</h6>
            <input
              className="form-control"
              type="number"
              name="descriptionlineNumber"
              value={value.descriptionlineNumber || ""}
              onChange={(e) => handleMenuValueChange(index, e)}
              placeholder="Line number"
            />
          </div>
        );
      }
    }
    return null;
  };

  // console.log(value);
  return (
    <div id="page-container" className="page_contclass">
      {/* Top Title Section */}
      <div className="top-title-sec d-flex align-items-center justify-content-between mb-30">
        <h1 className="heading24 mb-0">Upload Restaurant</h1>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 custbread">
            <li className="breadcrumb-item">
              <Link to="/admin/dashborad">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Upload Restaurant
            </li>
          </ol>
        </nav>
      </div>
      {loader && <ApiLoder />}
      {/* Upload Section */}
      <div className="inner-main-content">
        <div className="resturant-upload-top mb-30">
          <div className="upload-btn-sec d-flex justify-content-end gap-3 align-items-center">
            {/* Upload Buttons */}
            <div className="upload-btn-resturant">
              <button className="creatbtn">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 16V7.85L8.4 10.45L7 9L12 4L17 9L15.6 10.45L13 7.85V16H11ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z"
                    fill="#fff"
                  />
                </svg>
                Upload Restaurant
              </button>
              <input
                type="file"
                name="restaurantFile"
                accept="image/png,image/jpg,image/jpeg"
                onChange={(e) => {
                  UploadImage(e, ["image/png", "image/jpg", "image/jpeg"]);
                }}
              />
            </div>
            <div className="upload-btn-resturant">
              <button className="creatbtn">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 16V7.85L8.4 10.45L7 9L12 4L17 9L15.6 10.45L13 7.85V16H11ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z"
                    fill="#fff"
                  />
                </svg>
                Upload Menu
              </button>
              <input type="file"
                name="menuFile"
                accept="image/png,image/jpg,image/jpeg"
                multiple
                onChange={(e) => {
                  handleMultipleMenu(e)
                }}
              />
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="upload-resturant-sec mb-30" id="upload-resturantid">
          <div className="container-fluid">
            <div className="row">
              {/* Left Form */}
              <div className="col-lg-8">
                <div className="tablecard h-100">
                  <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
                    <h2 className="mb-0">Restaurant Detail</h2>
                  </div>
                  <div className="contentdivbox">
                    <div className="row align-items-center">
                      {/* Restaurant Name */}
                      <div className="col-lg-5 mb-3">
                        <div className="form-group">
                          <h6>Restaurant Name</h6>
                          <input type="text" className="form-control" value={input?.restaurantName} />
                        </div>
                      </div>
                      {/* Restaurant Radio Buttons */}
                      <div className="col-lg-7 mt-2">
                        <div className="d-flex gap-2 resturant-radio-btn">
                          {Object.entries(labels).map(([key, label]) => (
                            <div
                              key={key}
                              className="d-flex gap-2 align-items-center"
                            >
                              <label>{label}</label>
                              <input
                                className="form-check-input"
                                type="radio"
                                name="restaurantOptions"
                                value={key}
                                checked={selectedRestaurantOption === key}
                                onChange={(e) =>
                                  setSelectedRestaurantOption(e.target.value)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Dynamic Input */}
                      <div className="col-lg-12 mb-3">
                        {renderInputField(selectedRestaurantOption, "name")}
                      </div>
                    </div>

                    <div className="row align-items-center">
                      {/* Address */}
                      <div className="col-lg-5 mb-3">
                        <div className="form-group">
                          <h6>Address</h6>
                          <input type="text" className="form-control" value={input?.restaurantAddress} />
                        </div>
                      </div>
                      {/* Address Radio Buttons */}
                      <div className="col-lg-7 mt-2">
                        <div className="d-flex gap-2 resturant-radio-btn">
                          {Object.entries(labels).map(([key, label]) => (
                            <div
                              key={key}
                              className="d-flex gap-2 align-items-center"
                            >
                              <label>{label}</label>
                              <input
                                className="form-check-input"
                                type="radio"
                                name="addressOptions"
                                value={key}
                                checked={selectedAddressOption === key}
                                onChange={(e) =>
                                  setSelectedAddressOption(e.target.value)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Dynamic Input */}
                      <div className="col-lg-12 mb-3">
                        {renderInputField(selectedAddressOption, "address")}
                      </div>
                      <div className="btndiv d-flex align-items-center gap-3 justify-content-start mt-30 ps-3">
                        <Link to="#" className="btndarkblue" onClick={ParseName}>
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* Right Card */}
              <div className="col-lg-4">
                <div className="tablecard mb-30 h-100">
                  <div className="tableheader boderbtn">
                    <h2 className="mb-0">Receipt data</h2>
                  </div>
                  <div className="contentdivbox">
                    {value?.parsedData && (
                      <div className="split_text">
                        {value.parsedData.split("\n").map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        {parseData.map((line, index) => (
          <div key={index} className="upload-menu-sec" id="upload-menu-id">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-8">
                  <div className="tablecard h-100">
                    <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
                      <h2 className="mb-0">Menu Item Detail</h2>
                    </div>
                    <div className="contentdivbox">
                      <div className="row align-items-center">
                        <div className="col-lg-5 mb-3">
                          <div className="form-group">
                            <h6>Item Name</h6>
                            <input type="text" className="form-control" value={menuInput[index]?.itemName || ""} />
                          </div>
                        </div>
                        <div className="col-lg-7 mt-2">
                          <div className="d-flex gap-3 resturant-radio-btn">
                            {Object.entries(labels).map(([key, label]) => (
                              <div key={key} className="d-flex gap-2 align-items-center">
                                <label htmlFor="itemRadio1">{label}</label>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={`menuOption_${index}`}
                                  value={key}
                                  checked={selectedMenuOption[index] === key}
                                  onChange={(e) => {
                                    const updated = [...selectedMenuOption];
                                    updated[index] = e.target.value;
                                    setSelectedMenuOption(updated);
                                  }}
                                />{" "}
                              </div>))}
                          </div>
                        </div>
                        <div className="col-lg-12 mb-3">
                          {/* <div id="dynamicInputContainerItem" /> */}
                          {renderInputFieldMenu(selectedMenuOption[index], "name", index)}                        </div>
                      </div>
                      <div className="row align-items-center">
                        <div className="col-lg-5 mb-3">
                          <div className="form-group">
                            <h6>Description</h6>
                            <input type="text" className="form-control" value={menuInput[index]?.description || ""} />
                          </div>
                        </div>
                        <div className="col-lg-7 mt-2">
                          <div className="d-flex gap-3 resturant-radio-btn">
                            {Object.entries(labels).map(([key, label]) => (
                              <div key={key} className="d-flex gap-2 align-items-center">
                                <label htmlFor="descriptionRadio1">
                                  {label}
                                </label>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={`menuAddressOption_${index}`}
                                  value={key}
                                  checked={selectedMenuAddressOption[index] === key}
                                  onChange={(e) => {
                                    const updated = [...selectedMenuAddressOption];
                                    updated[index] = e.target.value;
                                    setSelectedMenuAddressOption(updated);
                                  }}
                                />{" "}
                              </div>))}
                          </div>
                        </div>
                        <div className="col-lg-12 mb-3">
                          {/* <div id="dynamicInputContainerDescription" /> */}
                          {renderInputFieldMenu(selectedMenuAddressOption[index], "address", index)}                        </div>
                        <div className="btndiv d-flex align-items-center gap-3 justify-content-start mt-30 ps-3">
                          <Link to="#" className="btndarkblue" onClick={(e) => ParseMenuData(index)}>
                            Review
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="tablecard mb-30 h-100">
                    <div className="tableheader boderbtn">
                      <h2 className="mb-0">Menu Item data</h2>
                    </div>
                    <div className="contentdivbox ">
                      <p style={{ whiteSpace: "pre-line" }}>{line}</p>
                      {/* <img src={defaultConfig.imagePath + pathArr[index]} alt="" /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="btndiv d-flex align-items-center gap-3 justify-content-start mt-30 ps-3">
          <Link to="#" className="btndarkblue" onClick={ParseMenuData}>
            Submit
          </Link>
          <Link to="#" className="btndarkblue-outline">
            Clear{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}
