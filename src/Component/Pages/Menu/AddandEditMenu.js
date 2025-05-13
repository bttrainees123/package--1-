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
import { defaultConfig } from "../../../config";
import { PlushSvg, UploadImageSvg } from "../../../SvgFile/Index";
import { Avatar, Chip } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { WithContext as ReactTags } from "react-tag-input";

export default function AddandEditMenu({
  open,
  handleclose,
  LogoListAPI,
  action,
  object,
  cat,
  resturentId,
  TagsListingData,
}) {
  const Options = [
    { name: "Monday" },
    { name: "Tuesday" },
    { name: "Wednesday" },
    { name: "Thursday" },
    { name: "Friday" },
    { name: "Saturday" },
    { name: "Sunday" },
  ];

  const inslizeState = {
    profileImage: "",
    status: "active",
    itemname: "",
    description: "",
    dayAvailabe: Options,
    itemnameAlias: [],
    startTime: "",
    endTime: "",
    tags: [],
    category: "",
    restaurantId: resturentId,
    isLeaderBoard: "0",
    points: "",
    isFakeLike: "0",
    isFakeHeart: "0",
    isFakeMenuReview: false,
    LoyaltyMessage: "",
    deliveryPartner: []
  };

  const [value, setValue] = useState(inslizeState);
  const [menu, setMenu] = useState("");
  const [referencesItem, setReferencesItem] = useState([
    {
      imageId: "",
      imageLink: "",
    },
  ]);
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [image, setImage] = useState("");
  const [, forceUpdate] = useState();
  const [logoList, setLogoList] = useState([]);
  const [selectedValue, setSelectedValue] = useState('No')
  const [isInputOpen, setIsInputOpen] = useState('')

  const handleChange = (e) => {
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const handleRadioChange = (val) => {
    setSelectedValue(val);
    if (val === 'Yes') {
      setIsInputOpen(true)
      handleValueChange("isFakeMenuReview", true);
    }
    else {
      setIsInputOpen(false)
      handleValueChange("isFakeMenuReview", false);
    }
  }

  // const handleZero = () => {
  //   handleValueChange("isFakeHeart", 0);
  //   handleValueChange("isFakeLike", 0);

  // }

  const handleValueChange = (name, value) => {
    if (name === "points") {
      console.log(name, value);

      const pointsValue = Number(value);
      if (!Number.isInteger(pointsValue) || pointsValue < 0) {
        ErrorMessage(
          "Points must be a positive integer (no decimals or letters)"
        );
        return;
      }
    }
    setValue((detail) => {
      return { ...detail, [name]: value };
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
        if (action === "add")
          var TagData = value?.tags?.map((item) => item?.text);
        const apiResponse = await callAPI(
          action === "add"
            ? apiUrls.addRestaurantMenuAdmin
            : apiUrls.updateRestaurantMenuAdmin + `/${object._id}`,
          {},
          action === "add" ? "POST" : "PUT",
          action === "add" ? { ...value, tags: TagData } : value
        );
        if (apiResponse?.data?.status === true) {
          SuccessMessage(apiResponse?.data?.message);

          setValue({ ...inslizeState, tags: [] });
          console.log("apiResponse", value.isFakeHeart)
          LogoListAPI();
          setReferencesItem([
            {
              imageId: "",
              imageLink: "",
            },
          ]);
          const Tages = value?.tags?.map((item) => {
            if (typeof item === "string") return item;
            else return item?.text;
          });
          Tagscreation(Tages);
          handleclose();
          setImage("");
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
    if (action === "edit" && open) {
      setValue({
        itemname: object?.itemname,
        profileImage: object?.profileImage,
        status: object?.status,
        description: object?.description,
        dayAvailabe: object?.dayAvailabe ? object?.dayAvailabe : [],
        itemnameAlias: object?.itemnameAlias ? object?.itemnameAlias : [],
        startTime: object?.startTime,
        endTime: object?.endTime,
        tags: object?.tags,
        category: object?.category?._id,
        restaurantId: resturentId,
        isLeaderBoard: object?.isLeaderBoard ? object?.isLeaderBoard : "0",
        points: object?.points ? object?.points : "",
        isFakeLike: object?.isFakeLike ? object?.isFakeLike : "0",
        isFakeHeart: object?.isFakeHeart ? object?.isFakeHeart : "0",
        isFakeMenuReview: object?.isFakeMenuReview ? object?.isFakeMenuReview : false,
        LoyaltyMessage: object?.LoyaltyMessage ? object?.LoyaltyMessage : "",
        deliveryPartner: object?.deliveryPartner?.length > 0 ? object?.deliveryPartner : []
      });
      if (object?.deliveryPartner?.length > 0) {
        setReferencesItem(object?.deliveryPartner);
      }
      setMenu(object?.itemname)
    } else {
      setReferencesItem([
        {
          imageId: "",
          imageLink: "",
        },
      ]);
      setValue(inslizeState);
      setMenu("")
    }
    // eslint-disable-next-line
  }, [object, action, open]);


  const suggestions =
    TagsListingData?.map((tag) => ({
      id: tag._id,
      text: tag.tag,
    })) || [];
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  // Handle deleting a tag
  const handleDelete = (i) => {
    const updatedTags = value.tags.filter((_, index) => index !== i);
    handleValueChange("tags", updatedTags);
  };


  // Handle adding a new tag
  const handleAddition = (tag) => {
    if (action === "edit") {
      const tagsList = value?.tags;
      tagsList.push(tag?.text);
      handleValueChange("tags", tagsList);
    } else {
      const tagsList = value?.tags;
      tagsList.push(tag);
      handleValueChange("tags", tagsList);
    }
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

  const UploadImage = async (e, allowedFileTypes) => {
    let file = e?.target?.files[0];
    let name = e?.target?.name;
    if (
      allowedFileTypes.includes(file?.type) ||
      allowedFileTypes.includes(file?.name?.split(".").reverse()[0])
    ) {
      const path = await PostImage(file);
      setImage(file);
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



  // const addItemPair = (item) => {
  //   let pairList = value?.menuPair;
  //   if (pairList.includes(item))
  //     pairList = value?.menuPair.filter((it) => {
  //       return it != item;
  //     });
  //   else pairList.push(item);
  //   setValue((val) => {
  //     return { ...val, ["menuPair"]: pairList };
  //   });
  // };



  const selectStatuss = (items) => {
    const matchedObject = value?.dayAvailabe?.find(
      (item) => item.name === items
    );
    if (matchedObject) {
      return "success";
    } else {
      return "default";
    }
  };

  const addItemPairs = (items) => {
    let pairList = [...value?.dayAvailabe];
    const matchedObject = value?.dayAvailabe.find(
      (item) => item.name === items.name
    );
    if (matchedObject) {
      pairList = pairList.filter((it) => it.name !== items.name);
    } else {
      pairList.push(items);
    }
    handleValueChange("dayAvailabe", pairList);
  };

  const addItem = () => {
    let itemList = value.itemnameAlias;
    itemList.push("");
    handleValueChange("itemnameAlias", itemList);
  };

  const deleteItem = (index) => {
    let itemList = value.itemnameAlias;
    itemList.splice(index, 1);
    handleValueChange("itemnameAlias", itemList);
  };

  const itemValueChange = (values, index) => {
    let itemList = value.itemnameAlias;
    itemList[index] = values;
    handleValueChange("itemnameAlias", itemList);
  };

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

  const handleChangeReferencesitem = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...referencesItem];
    const updatedItem = { ...updatedItems[index], [name]: value };
    updatedItems[index] = updatedItem;
    setReferencesItem(updatedItems);
    setValue((extra) => ({
      ...extra,
      deliveryPartner: updatedItems
    }));
  };


  const deleteReferencesRow = (deleteRow) => {
    const updatedEle = referencesItem.filter((val) => val !== deleteRow);
    setReferencesItem(updatedEle);
    setValue((extra) => ({ ...extra, deliveryPartner: updatedEle }));
  };

  const LogoListAPIs = async () => {
    try {
      let query = {};
      const apiResponse = await callAPI(
        apiUrls.logoread + "/active",
        query,
        "GET"
      );
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.length > 0) {
          setLogoList(apiResponse.data.data);
        } else {
          setLogoList([]);
        }
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      ErrorMessage(error?.message);
    }
  };

  useEffect(() => {
    LogoListAPIs();
  }, []);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleclose}
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
                  {action === "add" ? "Create" : "Update"}  {action !== "add" ? menu : "Menu item"}
                </h1>
                <p>Please enter your Menu details</p>
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
                      image
                        ? URL.createObjectURL(image)
                        : defaultConfig.imagePath + value?.profileImage
                    }
                    id="img-upload-tag"
                    className="img-fluid"
                    alt=""
                  />
                </figure>
                <div className="uplodtext d-flex align-items-center justify-content-center gap-2 position-relative">
                  <UploadImageSvg />
                  Upload a Image
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
                {/* <div className="error">
                  {simpleValidator.current.message(
                    "Image",
                    value?.profileImage,
                    `required`
                  )}
                </div> */}
              </div>
              <form className="formcontmodel mt-4">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleChange}
                      value={value.itemname}
                      name="itemname"
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "Name",
                        value?.itemname,
                        `required|min:3`
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Category *</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={handleChange}
                      value={value.category}
                      name="category"
                    >
                      <option value="">Select</option>
                      {cat?.map((val, i) => (
                        <option
                          key={i}
                          value={val._id}
                          selected={value.category === val._id}
                        >
                          {val?.name}
                        </option>
                      ))}
                    </select>
                    <div className="error">
                      {simpleValidator.current.message(
                        "Category",
                        value?.category,
                        `required`
                      )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-lg-12 col-md-12 col-12">
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
                  </div>
                  <div className="row">
                    {value?.itemnameAlias?.map((item, i) => {
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

                  <div className="col-lg-12 col-md-12 col-12 mb-3 mt-2">
                    <label htmlFor="">Days Available</label>
                    <div className="justify-content-start align-items-center gap-2">
                      {Options?.map((val, i) => (
                        <Chip
                          onClick={() => {
                            addItemPairs(val);
                          }}
                          key={i}
                          sx={{ my: 0.5, mx: 0.5 }}
                          avatar={<Avatar alt={val?.name} src={val?.name} />}
                          label={val?.name}
                          color={selectStatuss(val?.name)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Starting Time</label>
                    <input
                      type="time"
                      className="form-control"
                      onChange={handleChange}
                      value={value.startTime}
                      name="startTime"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Closing Time</label>
                    <input
                      type="time"
                      className="form-control"
                      onChange={handleChange}
                      value={value.endTime}
                      name="endTime"
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label htmlFor="" className="formcontmodellabel">
                      Loyalty Reward Message
                    </label>
                    <input
                      type="text"
                      value={value?.LoyaltyMessage}
                      name="LoyaltyMessage"
                      onChange={(e) => {
                        handleValueChange(e.target?.name, e.target?.value);
                      }}
                      className="form-control formcontmodelinput"
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label htmlFor="" className="formcontmodellabel">
                      Loyalty Points
                    </label>
                    <input
                      type="text"
                      value={value?.points}
                      name="points"
                      onChange={(e) => {
                        handleValueChange(e.target?.name, e.target?.value);
                      }}
                      className="form-control formcontmodelinput"
                    />
                  </div>
                  <div className="col-lg-12 col-md-12 col-12 mb-3">
                    <label htmlFor="">Tags</label>

                    <ReactTags
                      tags={
                        action === "edit"
                          ? Array.isArray(value?.tags)
                            ? value?.tags.map((text) => ({ id: text, text }))
                            : []
                          : value?.tags
                      }
                      suggestions={suggestions}
                      handleDelete={handleDelete}
                      handleAddition={handleAddition}
                      delimiters={[KeyCodes.comma, KeyCodes.enter]}
                      placeholder="Type and press Enter..."
                    />
                  </div>
                  <div className="col-lg-12 col-md-12 col-12 mb-3">
                    <label htmlFor="">Description</label>
                    <ReactQuill
                      theme="snow"
                      value={value.description}
                      onChange={(value) => {
                        handleValueChange("description", value);
                      }}
                    />

                    {/* <div className="error">
                      {simpleValidator.current.message(
                        "Name",
                        value?.description,
                        `required|min:3`
                      )}
                    </div> */}
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
                  <div>
                    <label htmlFor="" className="formcontmodellabel">isFakeMenuReview        </label>
                    <input className="col-md-1"
                      type="radio"
                      value={true}
                      checked={value?.isFakeMenuReview === true}
                      onChange={() => handleRadioChange('Yes')}
                    />Yes
                    <input className="col-md-1"
                      type="radio"
                      value={false}
                      checked={value?.isFakeMenuReview === false}
                      onChange={() => handleRadioChange('No')}
                    // onClick={handleZero}
                    />No

                  </div>
                  {value?.isFakeMenuReview &&
                    <>
                      <div className="col-5 mb-3">
                        <input
                          type="number"
                          value={value.isFakeLike}
                          name="isFakeLike"
                          onChange={(e) => {
                            handleValueChange(e.target?.name, e.target?.value);
                          }}
                          className="form-control formcontmodelinput"
                        />
                      </div>
                      <div className="col-5 mb-3">

                        <input
                          type="number"
                          value={value.isFakeHeart}
                          name="isFakeHeart"
                          onChange={(e) => {
                            handleValueChange(e.target?.name, e.target?.value);
                          }}
                          className="form-control formcontmodelinput"
                        />
                      </div>
                    </>
                  }

                  {/* <div className="col-lg-12 col-md-12 col-12 mb-3">
                    <label style={{ fontSize: "18px", fontWeight: "700", lineHeight: "normal" }}>Item Paring</label>
                    <div
                      className="justify-content-start align-items-center gap-2"
                    >
                      {logoList?.map((val, i) => (
                        val._id !== object._id &&
                        <Chip
                          onClick={() => {
                            addItemPair(val?._id);
                          }}
                          key={i}
                          sx={{ my: 0.5, mx: 0.5 }}
                          avatar={
                            <Avatar
                              alt={val?.itemname}
                              src={defaultConfig.imagePath + val?.profileImage}
                            />
                          }
                          label={val?.itemname}
                          variant={selectStatus(val?._id)}
                        />
                      ))}
                    </div>
                  </div> */}
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
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
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Menu visibility in carousel</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={handleChange}
                      value={value.isLeaderBoard}
                      name="isLeaderBoard"
                    >
                      <option value="1" selected={value.isLeaderBoard === "1"}>
                        hidden
                      </option>
                      <option value="0" selected={value.isLeaderBoard === "0"}>
                        visible
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
                onClick={() => {
                  setValue(inslizeState);
                  handleclose();
                }}
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
