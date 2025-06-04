import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import { PostImage, PostImageMultiple, PostImageMultipleMenu } from "../../../utils/apiCall";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { defaultConfig } from "../../../config";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import SimpleReactValidator from "simple-react-validator";
import { WithContext as ReactTags } from "react-tag-input";

export default function Index() {
  const [selectedRestaurantOption, setSelectedRestaurantOption] = useState("");
  const [selectedAddressOption, setSelectedAddressOption] = useState("");
  const [selectedMenuOption, setSelectedMenuOption] = useState([])
  const [selectedMenuDescriptionOption, setSelectedMenuDescriptionOption] = useState([]);
  const [selectedMenuTag, setSelectedMenuTag] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pathArr, setPathArr] = useState([])
  const [imgArr, setImgArr] = useState([])
  const [imgArrMenu, setImgArrMenu] = useState([])
  const [address, setAddress] = useState("");
  const [check, setCheck] = useState(false)
  const [catCheck, setCatCheck] = useState(false)
  const [resId, setResId] = useState('')
  const [parseData, setParseData] = useState([])
  const [menuPath, setMenuPath] = useState([])
  const [responseData, setResponseData] = useState({
    profileImage: '',
    stateCode: '',
    name: '',
    lattitude: 0,
    longitude: 0,
    address: '',
    receiptAddress: '',
    state: '',
    city: '',
  })
  const [menuData, setMenuData] = useState([{
    category: "",
    restaurantId: "",
    itemname: "",
    description: "",
    tags: [],
    img: [],
  }])
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
    descriptionlineNumber: '',
    tagsStartWith: '',
    tagsEndWith: '',
    tagsstartFrom: '',
    tagsendFrom: '',
    tagslineNumber: '',
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
  const [logoList, setLogoList] = useState([]);
  const [TagsData, setTagsData] = useState([]);
  const [input, seInput] = useState({
    restaurantAddress: "",
    restaurantName: ""
  });
  const [menuInput, setMenuInput] = useState([{
    itemName: "",
    description: "",
    tags: [],
    category: "",
  }])
  const [cat, setCat] = useState([]);
  // const [catId, setCatId] = useState('')

  const suggestions = TagsData?.map((tag) => ({
    id: tag._id,
    text: tag.tag,
  })) || [];

  const resDataRef = useRef(responseData)

  const tagApi = async () => {
    try {
      let query = {};
      const apiResponse = await callAPI(apiUrls.tagList, query, "GET");
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.length > 0) {
          setTagsData(apiResponse.data.data);
        } else {
          setTagsData([]);
        }
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      ErrorMessage(error?.message);
    }
  };

  const CatListAPI = async () => {
    try {
      let query = {
        restaurantId: resId,
      };
      const apiResponse = await callAPI(
        apiUrls.categoryListOfRestaurant,
        query,
        "GET"
      );
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.length > 0) {
          setCat(apiResponse?.data?.data);
          setCatCheck(true)
        } else {
          setCat([]);
        }
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      ErrorMessage(error?.message);
    }
  };

  useEffect(() => {
    if (resId) {
      setCatCheck(false)
      CatListAPI();
      tagApi();
    }
  }, [resId]);

  const handleAddition = (index, tag) => {
    const tagsList = menuData[index]?.tags || [];
    tagsList.push(tag?.text);
    handleValueChange("tags", tagsList, index);
  }

  const handleDelete = (index, i) => {
    const updatedTags = menuData[index]?.tags.filter((_, index) => index !== i);
    handleValueChange("tags", updatedTags, index);
  };

  const handleValueChange = (name, value, index) => {
    const updatedMenuData = [...menuData];
    updatedMenuData[index] = {
      ...updatedMenuData[index],
      [name]: value
    };
    setMenuData(updatedMenuData);
    setMenuInput((prev) => {
      const updatedInputs = [...prev];
      updatedInputs[index] = {
        ...updatedInputs[index],
        [name]: value
      };
      return updatedInputs;
    });
  };

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const handleMultipleMenu = async (e) => {
    const files = Array.from(e.target.files);
    const updatedImgArr = [...imgArr, ...files];
    setImgArr(updatedImgArr);
    const path = await PostImageMultiple(updatedImgArr);
    pathArr.push(...path);
    setPathArr(pathArr);
    if (path?.length > 0) handleMultiplePath(path);
    e.target.value = null;
  };

  const handleMultipleMenuList = async (e) => {
    const files = Array.from(e.target.files);
    const updatedImgArr = [...imgArrMenu, ...files];
    setImgArrMenu(updatedImgArr);
    const path = await PostImageMultipleMenu(updatedImgArr);
    setMenuPath(path);
    e.target.value = null;
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
  }, [check]);
  const handleChange = (e) => {
    setResId(e.target.value)
    menuData.forEach(obj => {
      obj["restaurantId"] = e.target.value;
    });
  };

  const handleCatChange = (e, i) => {
    const updatedCatList = [...menuData]
    updatedCatList[i] = {
      ...updatedCatList[i],
      [e.target.name]: e.target.value
    }
    setMenuData(updatedCatList)
    const newData = [...menuInput];
    newData[i] = {
      ...menuData[i],
      [e.target.name]: e.target.value
    }
    setMenuInput(newData)
  };

  const handleClear = () => {
    setSelectedRestaurantOption("")
    setSelectedAddressOption("")
    seInput({
      restaurantAddress: "",
      restaurantName: ""
    })
    setValue({
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
    })
    setResponseData({
      profileImage: '',
      stateCode: '',
      name: '',
      lattitude: 0,
      longitude: 0,
      address: '',
      receiptAddress: '',
      state: '',
      city: '',
    })
  }

  const handleResCreate = async () => {
    try {
      setLoader(true)
      const apiResponse = await callAPI(apiUrls.resturentCreate, {}, "POST", responseData);
      if (apiResponse?.data?.status) {
        SuccessMessage(apiResponse?.data?.message)
        handleClear()
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
      setLoader(false);
    }
    catch (error) {
      setLoader(false);
      ErrorMessage(error?.message);
    }
  }

  const handleMenuValueChange = (index, event) => {
    const { name, value } = event.target;
    const updatedValues = [...menuValue];
    updatedValues[index] = { ...updatedValues[index], [name]: value };
    setMenuValue(updatedValues);
  };

  useEffect(() => {
    resDataRef.current = responseData;
    console.log("Updated Menu ResData: ", resDataRef.current);
  }, [responseData]);

  const ParseMenuData = async (index) => {
    try {
      setLoader(true);
      const data = { parsedData: parseData[index] };
      const menuOpt = selectedMenuOption[index];
      menuData.forEach(obj => {
        obj["restaurantId"] = resId;
        // obj["category"] = catId;
      });
      if (menuOpt) {
        if (menuOpt === "startWith") data.nameStartWith = menuValue[index].nameStartWith;
        else if (menuOpt === "endWith") data.nameEndWith = menuValue[index].nameEndWith;
        else if (menuOpt === "between") {
          data.namestartFrom = menuValue[index].namestartFrom;
          data.nameendFrom = menuValue[index].nameendFrom;
        } else if (menuOpt === "chef") data.namelineNumber = menuValue[index].namelineNumber;
      }
      const descriptionOpt = selectedMenuDescriptionOption[index];
      if (descriptionOpt) {
        if (descriptionOpt === "startWith") data.descriptionStartWith = menuValue[index].descriptionStartWith;
        else if (descriptionOpt === "endWith") data.descriptionEndWith = menuValue[index].descriptionEndWith;
        else if (descriptionOpt === "between") {
          data.descriptionstartFrom = menuValue[index].descriptionstartFrom;
          data.descriptionendFrom = menuValue[index].descriptionendFrom;
        } else if (descriptionOpt === "chef") data.descriptionlineNumber = menuValue[index].descriptionlineNumber;
      }
      const tagOpt = selectedMenuTag[index];
      if (tagOpt) {
        if (tagOpt === "startWith") data.tagsStartWith = menuValue[index].tagsStartWith;
        else if (tagOpt === "endWith") data.tagsEndWith = menuValue[index].tagsEndWith;
        else if (tagOpt === "between") {
          data.tagsstartFrom = menuValue[index].tagsstartFrom;
          data.tagsendFrom = menuValue[index].tagsendFrom;
        } else if (tagOpt === "chef") data.tagslineNumber = menuValue[index].tagslineNumber;
      }

      const apiResponse = await callAPI(apiUrls.menuParser, {}, "POST", data);
      if (apiResponse?.data?.status) {
        const updatedInputs = [...menuInput];
        updatedInputs[index] = {
          ...updatedInputs[index],
          itemName: apiResponse?.data?.data?.menuName,
          description: apiResponse?.data?.data?.menuDescription,
          tags: apiResponse?.data?.data?.tags,
        };
        setMenuInput(updatedInputs);
        const newData = [...menuData];
        newData[index] = {
          ...newData[index],
          // category: catId || "",
          restaurantId: resId || "",
          itemname: apiResponse?.data?.data?.menuName || "",
          description: apiResponse?.data?.data?.menuDescription || "",
          tags: apiResponse?.data?.data?.tags || "",
        }
        setMenuData(newData)
        SuccessMessage(apiResponse?.data?.message);
      } else {
        ErrorMessage(apiResponse?.data?.message);
        const resetInputs = [...menuInput];
        resetInputs[index] = { itemName: "", description: "", tags: [] };
        setMenuInput(resetInputs);
      }
      setLoader(false);
    } catch (error) {
      const resetInputs = [...menuInput];
      resetInputs[index] = { itemName: "", description: "", tags: [] };
      setMenuInput(resetInputs);
      setLoader(false);
      ErrorMessage(error?.message);
    }
  };

  const handleImageClose = (e, i) => {
    const newFormValues = [...imgArrMenu]
    newFormValues.splice(i, 1)
    setImgArrMenu(newFormValues)
    const newFormValuesPath = [...menuPath]
    newFormValuesPath.splice(i, 1)
    setMenuPath(newFormValuesPath)
  }

  const handleMultiplePath = async (path) => {
    try {
      setLoader(true);
      const apiResponse = await callAPI(apiUrls.reciptMenuParserAdmin, {}, "POST", { images: path })
      if (apiResponse?.data?.status) {
        setParseData((prev) => [...prev, ...apiResponse?.data?.data]);
        setCheck(true)
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

  const handleMenuClear = () => {
    setSelectedMenuTag('')
    setSelectedMenuDescriptionOption('')
    setSelectedMenuOption('')
    setMenuInput([{
      itemName: "",
      description: "",
      tags: []
    }])
    setResId('')
    // setCatId('')
    setMenuPath([])
    setImgArrMenu([])
    setMenuValue([{
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
      descriptionlineNumber: '',
      tagsStartWith: '',
      tagsEndWith: '',
      tagsstartFrom: '',
      tagsendFrom: '',
      tagslineNumber: '',
    }])
    setMenuData([{
      category: "",
      restaurantId: "",
      itemname: "",
      description: "",
      tags: [],
    }])
    setParseData([])
    setCheck(false)
    setCatCheck(false)
  }

  const handleMenuCreate = async () => {
    if (!resId) {
      return ErrorMessage("Select Restaurant");
    }

    if (parseData.length !== menuInput.length) {
      return ErrorMessage("Item name is required");
    }
    for (let i = 0; i < menuInput.length; i++) {
      if (menuInput[i].itemName === '') {
        return ErrorMessage("Item name is required");
      }
      if (menuInput[i].description === '') {
        return ErrorMessage("Description is required");
      }
      if (menuInput[i].category === '') {
        return ErrorMessage("Select Category");
      }
    }
    try {
      setLoader(true);
      const apiResponse = await callAPI(apiUrls.menuCreate, {}, "POST", { menuData: menuData, images: menuPath });
      if (apiResponse?.data?.status) {
        SuccessMessage(apiResponse?.data?.message)
        // handleMenuClear()
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
      setLoader(false);
    }
    catch (error) {
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

  const UploadProfilePic = async (e, allowedFileTypes) => {
    let file = e?.target?.files[0];
    if (
      allowedFileTypes.includes(file?.type) ||
      allowedFileTypes.includes(file?.name?.split(".").reverse()[0])
    ) {
      const path = await PostImage(file);
      if (path?.length > 0) {
        setResponseData((val) => ({ ...val, profileImage: path[0] }))
        SuccessMessage("Profile pic uploaded successfully")
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
        SuccessMessage(apiResponse?.data?.message);
        handleAddress(apiResponse?.data?.data.restaurantAddress, apiResponse?.data?.data.restaurantName)
        setResponseData((val) => ({ ...val, receiptAddress: apiResponse?.data?.data.restaurantAddress, address: apiResponse?.data?.data.restaurantAddress, name: apiResponse?.data?.data.restaurantName }));
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

  const handleAddress = async (address, name) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      setResponseData((val) => ({
        ...val,
        lattitude: latLng?.lat,
        longitude: latLng?.lng,
        postal_code: results[0]?.address_components[results[0]?.address_components?.length - 1]?.short_name,
        state: results[0]?.address_components[results[0]?.address_components?.length - 2]?.long_name,
        stateCode: results[0]?.address_components[results[0]?.address_components?.length - 2]?.long_name.slice(0, 2).toUpperCase(),
        city: results[0]?.address_components[results[0]?.address_components?.length - 3]?.long_name,
        name: input.restaurantName ? input.restaurantName : name,
        address: results[0].formatted_address,
        receiptAddress: results[0].formatted_address,
      }))
    } catch (error) {
      console.error("Error fetching latitude and longitude:", error);
    }
  }

  const labels = {
    startWith: "Start With",
    endWith: "End With",
    between: "Between",
    chef: "Line Number",
  };

  const handleFieldDelete = (ind) => {
    setLoader(true);
    setMenuInput((prev) => {
      const updatedValues = [...prev];
      updatedValues.splice(ind, 1);
      return updatedValues;
    });
    setMenuValue((prev) => {
      const updatedValues = [...prev];
      updatedValues.splice(ind, 1);
      return updatedValues;
    });
    setMenuData((prev) => {
      const updatedValues = [...prev];
      updatedValues.splice(ind, 1);
      return updatedValues;
    })
    setParseData((prev) => {
      const updatedValues = [...prev];
      updatedValues.splice(ind, 1);
      return updatedValues;
    })
    setLoader(false);
  }

  const renderInputField = (selectedOption, type) => {
    if (!selectedOption) return null;
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
              type="text"
              name="namelineNumber"
              value={value.namelineNumber || ""}
              onChange={(e) => handleMenuValueChange(index, e)}
              placeholder="Line number"
            />
          </div>
        );
      }
    } else if (type === "description") {
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
              type="text"
              name="descriptionlineNumber"
              value={value.descriptionlineNumber || ""}
              onChange={(e) => handleMenuValueChange(index, e)}
              placeholder="Line number"
            />
          </div>
        );
      }
    } else if (type === "tags") {
      if (selectedOption === "startWith") {
        return (
          <div className="form-group">
            <h6>Start With</h6>
            <input
              className="form-control"
              type="text"
              name="tagsStartWith"
              value={menuValue[index].tagsStartWith || ""}
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
              name="tagsEndWith"
              value={menuValue[index].tagsEndWith || ""}
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
                name="tagsstartFrom"
                value={menuValue[index].tagsstartFrom || ""}
                onChange={(e) => handleMenuValueChange(index, e)}
                placeholder="Enter start from"
              />
            </div>
            <div className="form-group">
              <h6>End From</h6>
              <input
                className="form-control"
                type="text"
                name="tagsendFrom"
                value={menuValue[index].tagsendFrom || ""}
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
              type="text"
              name="tagslineNumber"
              value={menuValue[index].tagslineNumber || ""}
              onChange={(e) => handleMenuValueChange(index, e)}
              placeholder="Line number"
            />
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div id="page-container" className="page_contclass">
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
      <div className="inner-main-content" >
        <div className="contentdivbox tablecard gap-4 d-flex" style={{ margin: '10px' }}>
          <div className="contentdivbox_content flex-grow-1 d-flex flex-column gap-3 contentdivbox_contentnew">
            <div className="d-flex flexcustom gap-3 flex-wrap">
              <div className="resturant-upload-top mb-20" >
                <div className="upload-btn-sec d-flex justify-content-end gap-3 align-items-center" >
                  <div className="contentdivbox" style={{ marginRight: '400px' }}>
                    {responseData.profileImage && (
                      <img src={defaultConfig.imagePath + responseData.profileImage} alt="" style={{ height: '80px', width: '80%', borderRadius: '50%' }} />
                    )}
                  </div>
                  <div className="upload-btn-resturant" style={{ marginLeft: '118px' }}>
                    <button className="creatbtn" >
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
                      Restaurant Profile Pic
                    </button>
                    <input
                      type="file"
                      name="restaurantFile"
                      accept="image/png,image/jpg,image/jpeg"
                      onChange={(e) => {
                        UploadProfilePic(e, ["image/png", "image/jpg", "image/jpeg"]);
                      }}
                    />
                  </div>
                  <div className="upload-btn-resturant" style={{ marginLeft: '5px' }}>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="upload-resturant-sec mb-3" id="upload-resturantid">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-8">
                <div className="tablecard h-100">
                  <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
                    <h2 className="mb-0">Restaurant Detail</h2>
                  </div>
                  <div className="contentdivbox">
                    <div className="row align-items-center">
                      <div className="col-lg-5 mb-3">
                        <div className="form-group">
                          <h6>Restaurant Name</h6>
                          <input type="text" className="form-control" value={input.restaurantName} onChange={(e) => {
                            seInput((prev) => ({ ...prev, restaurantName: e.target.value }))
                            setResponseData((val) => ({ ...val, name: e.target.value }));
                          }} />
                        </div>
                      </div>
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
                      <div className="col-lg-12 mb-3">
                        {renderInputField(selectedRestaurantOption, "name")}
                      </div>
                    </div>
                    <div className="row align-items-center">
                      <div className="col-lg-5 mb-3">
                        <div className="form-group">
                          <div className="col-lg-12 col-md-6 col-12 mb-3">
                            <label htmlFor="">Address </label>
                            <PlacesAutocomplete
                              value={responseData.address}
                              onChange={(address) => {
                                setAddress(address)
                                seInput((val) => ({ ...val, restaurantAddress: address }))
                                setResponseData((val) => ({ ...val, address, receiptAddress: address }));
                              }}
                              onSelect={handleAddress}
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
                          </div>
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
                      <div className="btndiv d-flex align-items-center gap-3 justify-content-start mt-30 ps-3" >
                        <Link to="#" className="btndarkblue" onClick={ParseName}>
                          Review
                        </Link>
                        <Link to="#" className="btndarkblue" onClick={handleResCreate}>
                          Submit
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
        <div className="contentdivbox tablecard gap-4 d-flex" style={{ margin: '10px' }}>
          <div className="contentdivbox_content flex-grow-1 d-flex flex-column gap-3 contentdivbox_contentnew">
            <div className="d-flex flexcustom gap-3 flex-wrap">
              {check && (

                <div className="col-lg-12 col-md-12 col-12 mb-3" style={{ width: '250px', marginLeft: "11px" }}>
                  <label htmlFor="">Select Restaurant *</label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    onChange={handleChange}
                    value={resId}
                    name="restaurantId"
                  >
                    <option value="">Select</option>
                    {logoList?.map((val, i) => (
                      <option value={val._id} key={i}>{val.name}</option>
                    ))}
                  </select>
                </div>)}

            </div>
          </div>
          <div className="upload-btn-resturant" style={{ marginTop: '23px', marginLeft: "0px" }}>
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
          <div className="upload-btn-resturant" style={{ marginTop: '23px', marginLeft: "0px" }}>
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
              Upload Menu Images
            </button>
            <input
              type="file"
              name="menuFile"
              accept="image/png,image/jpg,image/jpeg"
              multiple
              onChange={(e) => {
                handleMultipleMenuList(e)
              }}
            />
          </div>
        </div>
        {menuPath.length > 0 &&
          <div className="contentdivbox tablecard gap-4 d-flex" style={{ margin: '10px' }}>
            <div className="contentdivbox_content flex-grow-1 d-flex flex-column gap-3 contentdivbox_contentnew">
              <div className="d-flex flexcustom gap-3 flex-wrap">
                {menuPath.length > 0 && menuPath.map((img, i) => {
                  return (
                    <div>
                      <a className="shadow-lg rounded" style={{
                        position: 'relative',
                        display: 'inline-flex',
                      }}>
                        <img key={i} src={defaultConfig.imagePath + img} alt={img} style={{ height: '90px', width: 'auto' }} />
                        <span onClick={(e) => handleImageClose(e, i)} id='my-icon' className="close AClass" style={{
                          position: 'absolute',
                          // fontSize: '10px',
                          top: '0',
                          right: '0',
                          zIndex: '1',
                          width: '13px !important',
                          height: '13px !important',
                          cursor: 'pointer',
                          borderRadius: '50%',
                          backgroundColor: 'rgb(97, 95, 95)',
                          color: 'white'
                        }}>&times;</span>
                      </a>
                      <p>{img.substring(0, img.lastIndexOf('.'))}</p>
                    </div>)
                })}
              </div>
            </div>
          </div>}
        {/* Menu Section */}
        {parseData.map((line, index) => (
          <div key={index} className="upload-menu-sec mb-3" id="upload-menu-id">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-8">
                  <div className="tablecard h-100">
                    <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
                      <h2 className="mb-0">Menu Item Detail</h2>
                      {catCheck && (<div className="col-lg-12 col-md-12 col-12 mb-3" style={{ width: '250px' }}>
                        <label htmlFor="">Select Category *</label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={(e) => handleCatChange(e, index)}
                          value={menuInput[index]?.category}
                          name="category"
                        >
                          <option value="">Select</option>
                          {cat?.map((val, i) => (
                            <option value={val._id} key={i}>{val.name}</option>
                          ))}
                        </select>
                      </div>)}
                    </div>
                    <div className="contentdivbox">
                      <div className="row align-items-center">
                        <div className="col-lg-5 mb-3">
                          <div className="form-group">
                            <h6>Item Name</h6>
                            <input type="text" className="form-control" value={menuInput[index]?.itemName || ""} onChange={(e) => {
                              if (menuInput[index]?.itemName == '') {
                                ErrorMessage("Item name is required")
                              }
                              const updatedInputs = [...menuInput];
                              updatedInputs[index] = {
                                ...updatedInputs[index],
                                itemName: e.target.value
                              };
                              setMenuInput(updatedInputs);
                              const newData = [...menuData];
                              newData[index] = {
                                ...newData[index],
                                // category: catId || "",
                                restaurantId: resId || "",
                                itemname: e.target.value,
                              }
                              setMenuData(newData)
                            }} />
                          </div>
                        </div>
                        <div className="col-lg-7 mt-2">
                          <div className="d-flex gap-2 resturant-radio-btn">
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
                          {renderInputFieldMenu(selectedMenuOption[index], "name", index)}
                        </div>
                      </div>
                      <div className="row align-items-center">
                        <div className="col-lg-5 mb-3">
                          <div className="form-group">
                            <h6>Description</h6>
                            <input type="text" className="form-control" value={menuInput[index]?.description || ""} onChange={(e) => {
                              if (menuInput[index]?.description == '') {
                                ErrorMessage("Description is required")
                              }
                              const updatedInputs = [...menuInput];
                              updatedInputs[index] = {
                                ...updatedInputs[index],
                                description: e.target.value
                              };
                              setMenuInput(updatedInputs)
                              const newData = [...menuData];
                              newData[index] = {
                                ...newData[index],
                                // category: catId || "",
                                restaurantId: resId || "",
                                description: e.target.value,
                              }
                              setMenuData(newData)
                            }} />
                          </div>
                        </div>
                        <div className="col-lg-7 mt-2">
                          <div className="d-flex gap-2 resturant-radio-btn">
                            {Object.entries(labels).map(([key, label]) => (
                              <div key={key} className="d-flex gap-2 align-items-center">
                                <label htmlFor="descriptionRadio1">
                                  {label}
                                </label>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={`menuDescriptionOption_${index}`}
                                  value={key}
                                  checked={selectedMenuDescriptionOption[index] === key}
                                  onChange={(e) => {
                                    const updated = [...selectedMenuDescriptionOption];
                                    updated[index] = e.target.value;
                                    setSelectedMenuDescriptionOption(updated);
                                  }}
                                />{" "}
                              </div>))}
                          </div>
                        </div>
                        <div className="col-lg-12 mb-3">
                          {renderInputFieldMenu(selectedMenuDescriptionOption[index], "description", index)}
                        </div>
                      </div>
                      <div className="row align-items-center">
                        <div className="col-lg-5 mb-3">
                          <div className="form-group">
                            <h6>Tags</h6>
                            <ReactTags
                              tags={
                                Array.isArray(menuData[index]?.tags)
                                  ? menuData[index]?.tags.map((text) => ({ id: text, text }))
                                  : []
                              }
                              suggestions={suggestions}
                              handleDelete={(i) => handleDelete(index, i)}
                              handleAddition={(tag) => handleAddition(index, tag)}
                              delimiters={[KeyCodes.comma, KeyCodes.enter]}
                              placeholder="Type and press Enter..."
                              minQueryLength={1}
                            />
                          </div>
                        </div>
                        <div className="col-lg-7 mt-2">
                          <div className="d-flex gap-2 resturant-radio-btn">
                            {Object.entries(labels).map(([key, label]) => (
                              <div key={key} className="d-flex gap-2 align-items-center">
                                <label htmlFor="tags1">
                                  {label}
                                </label>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  // name={`menuTagOption_${index}`}
                                  value={key}
                                  checked={selectedMenuTag[index] === key}
                                  onChange={(e) => {
                                    const updated = [...selectedMenuTag];
                                    updated[index] = e.target.value;
                                    setSelectedMenuTag(updated);
                                  }}
                                />{" "}
                              </div>))}
                          </div>
                        </div>
                        <div className="col-lg-12 mb-3">
                          {renderInputFieldMenu(selectedMenuTag[index], "tags", index)}
                        </div>
                        <div className="btndiv d-flex align-items-center gap-3 justify-content-start mt-30 ps-3">
                          <Link to="#" className="btndarkblue" onClick={(e) => ParseMenuData(index)}>
                            Review
                          </Link>
                          <Link to="#" className="btn btn-danger" onClick={(e) => handleFieldDelete(index)}>
                            Delete
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {parseData.length > 0 && (<div className="btndiv d-flex align-items-center gap-3 justify-content-start mt-30 ps-3">
          <button to="#" className="btndarkblue" onClick={handleMenuCreate}>
            Submit
          </button>
          <button to="#" className="btndarkblue-outline" onClick={handleMenuClear}>
            Clear{" "}
          </button>
        </div>)}
      </div>
    </div>
  );
}
