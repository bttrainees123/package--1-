import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { callAPI } from '../../../utils/apiUtils'
import { apiUrls } from '../../../utils/apiUrls'
import { ApiLoder, ErrorMessage, SuccessMessage } from '../../../helpers/common'
import { PostImage } from '../../../utils/apiCall'
import SimpleReactValidator from 'simple-react-validator'
import { Dialog } from '@mui/material'

const AddReceiptConfig = ({ open,
    handleclose, LogoListAPI }) => {
    const [loader, setLoader] = useState(false);
    const [resId, setResId] = useState('')
    const [logoList, setLogoList] = useState([]);
    const simpleValidator = useRef(new SimpleReactValidator());
    const [, forceUpdate] = useState();


    const [value, setValue] = useState({
        restaurantId: "",
        restaurantName: "",
        restaurantNameStartWith: "",
        restaurantNameEndWith: "",
        restaurantNameStartFrom: "",
        restaurantNameEndFrom: "",
        restaurantNameLineNumber: [],
        restaurantAddress: "",
        restaurantAddressStartWith: "",
        restaurantAddressEndWith: "",
        restaurantAddressStartFrom: "",
        restaurantAddressEndFrom: "",
        restaurantAddressLineNumber: [],
        receiptNumber: "",
        receiptNumberStartWith: "",
        receiptNumberEndWith: "",
        receiptNumberStartFrom: "",
        receiptNumberEndFrom: "",
        receiptNumberLineNumber: [],
        total_price: "",
        total_priceStartWith: "",
        total_priceEndWith: "",
        total_priceStartFrom: "",
        total_priceEndFrom: "",
        total_priceLineNumber: [],
        menuItems: [],
        menuItemsStartWith: "",
        menuItemsEndWith: "",
        menuItemsStartFrom: "",
        menuItemsEndFrom: "",
        menuItemsLineNumber: [],
        date: "",
        dateStartWith: "",
        dateEndWith: "",
        dateStartFrom: "",
        dateEndFrom: "",
        dateLineNumber: [],
        time: "",
        timeStartWith: "",
        timeEndWith: "",
        timeStartFrom: "",
        timeEndFrom: "",
        timeLineNumber: [],

    });

    const [selectedRestaurantOption, setSelectedRestaurantOption] = useState("");
    const [selectedAddressOption, setSelectedAddressOption] = useState("");
    const [selectedReceiptNumberOption, setSelecteReceiptNumberOption] = useState("");
    const [selectedTotalPriceOption, setSelecteTotalPriceOption] = useState("");
    const [selectedMenuItemsOption, setSelecteMenuItemsOption] = useState("");
    const [selectedDateOption, setSelecteDateOption] = useState("");
    const [selectedTimeOption, setSelecteTimeOption] = useState("");
    const [input, seInput] = useState({
        restaurantAddress: "",
        restaurantName: "",
        receiptNumber: '',
        total_price: '',
        menuItems: '',
        date: "",
        time: ""
    });



    const handleClear = () => {
        setSelectedRestaurantOption("")
        setSelectedAddressOption("")
        setSelecteReceiptNumberOption("")
        setSelecteTotalPriceOption("")
        setSelecteMenuItemsOption("")
        setSelecteDateOption("")
        setSelecteTimeOption("")
        seInput({
            restaurantAddress: "",
            restaurantName: "",
            receiptNumber: '',
            total_price: '',
            menuItems: '',
            date: "",
            time: ""
        })
        setValue({
            restaurantId: "",
            restaurantName: "",
            restaurantNameStartWith: "",
            restaurantNameEndWith: "",
            restaurantNameStartFrom: "",
            restaurantNameEndFrom: "",
            restaurantNameLineNumber: [],
            restaurantAddress: "",
            restaurantAddressStartWith: "",
            restaurantAddressEndWith: "",
            restaurantAddressStartFrom: "",
            restaurantAddressEndFrom: "",
            restaurantAddressLineNumber: [],
            receiptNumber: "",
            receiptNumberStartWith: "",
            receiptNumberEndWith: "",
            receiptNumberStartFrom: "",
            receiptNumberEndFrom: "",
            receiptNumberLineNumber: "",
            total_price: "",
            total_priceStartWith: "",
            total_priceEndWith: "",
            total_priceStartFrom: "",
            total_priceEndFrom: "",
            total_priceLineNumber: [],
            menuItems: [],
            menuItemsStartWith: "",
            menuItemsEndWith: "",
            menuItemsStartFrom: "",
            menuItemsEndFrom: "",
            menuItemsLineNumber: [],
            date: "",
            dateStartWith: "",
            dateEndWith: "",
            dateStartFrom: "",
            dateEndFrom: "",
            dateLineNumber: [],
            time: "",
            timeStartWith: "",
            timeEndWith: "",
            timeStartFrom: "",
            timeEndFrom: "",
            timeLineNumber: [],
        })

    }
    const handleChange = (e) => {
        setResId(e?.target?.value)
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
    }, []);


    const renderInputField = (selectedOption, type) => {
        if (!selectedOption) return null;
        // const prefix = type === "name" ? "name" : "address";
        let prefix = ""
        if (type === "name") {
            prefix = "restaurantName"
        }
        else if (type === "address") {
            prefix = "restaurantAddress"
        }
        else if (type === "receiptNumber") {
            prefix = "receiptNumber"
        }
        else if (type === "total_price") {
            prefix = "total_price"
        }
        else if (type === "date") {
            prefix = "date"
        }
        else if (type === "time") {
            prefix = "time"
        }
        else if (type === "menuItems") {
            prefix = "menuItems"
        }
        if (selectedOption === "chef") {
            const fieldName = prefix + "LineNumber";
            return (
                <div className="form-group">
                    <h6>{labels[selectedOption]}</h6>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Start From"
                        value={value[fieldName]}
                        onChange={(e) => {
                            const lineNumber = e?.target?.value
                            const stringArray = lineNumber.split(',').map(s => s.trim())
                            setValue((prev) => ({ ...prev, [fieldName]: stringArray }))
                        }}
                    />
                </div>
            );

        } else if (selectedOption === "between") {
            const startField = prefix + "StartFrom";
            const endField = prefix + "EndFrom";
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

    const labels = {
        startWith: "Start With",
        endWith: "End With",
        between: "Between",
        chef: "Line Number",
    };

    const menuLabels = {
        between: "Between",
    }

    const handleResCreate = async () => {
        const formValid = simpleValidator.current.allValid();
        if (!formValid) {
            simpleValidator.current.showMessages();
            forceUpdate(1);
        } else {
            try {
                setLoader(true)
                const apiResponse = await callAPI(apiUrls.createReciptConfig, {}, "POST", value);
                if (apiResponse?.data?.status) {
                    LogoListAPI()
                    handleclose()
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

    }

    const ParseName = async () => {
        try {
            setLoader(true);
            let data = {
                parsedData: value?.parsedData,
                restaurantId: resId,
            };

            if (selectedRestaurantOption) {
                if (selectedRestaurantOption === "startWith") {
                    data.restaurantNameStartWith = value.restaurantNameStartWith;
                } else if (selectedRestaurantOption === "endWith") {
                    data.restaurantNameEndWith = value.restaurantNameEndWith;
                } else if (selectedRestaurantOption === "between") {
                    data.restaurantNameStartFrom = value.restaurantNameStartFrom;
                    data.restaurantNameEndFrom = value.restaurantNameEndFrom;
                } else if (selectedRestaurantOption === "chef") {
                    data.restaurantNameLineNumber = value.restaurantNameLineNumber;
                }
            }
            if (selectedAddressOption) {
                if (selectedAddressOption === "startWith") {
                    data.restaurantAddressStartWith = value.restaurantAddressStartWith;
                } else if (selectedAddressOption === "endWith") {
                    data.restaurantAddressEndWith = value.restaurantAddressEndWith;
                } else if (selectedAddressOption === "between") {
                    data.restaurantAddressStartFrom = value.restaurantAddressStartFrom;
                    data.restaurantAddressEndFrom = value.restaurantAddressEndFrom;
                } else if (selectedAddressOption === "chef") {
                    data.restaurantAddressLineNumber = value.restaurantAddressLineNumber;
                }
            }
            if (selectedReceiptNumberOption) {
                if (selectedReceiptNumberOption === "startWith") {
                    data.receiptNumberStartWith = value.receiptNumberStartWith;
                } else if (selectedReceiptNumberOption === "endWith") {
                    data.receiptNumberEndWith = value.receiptNumberEndWith;
                } else if (selectedReceiptNumberOption === "between") {
                    data.receiptNumberStartFrom = value.receiptNumberStartFrom;
                    data.receiptNumberEndFrom = value.receiptNumberEndFrom;
                } else if (selectedReceiptNumberOption === "chef") {
                    data.receiptNumberLineNumber = value.receiptNumberLineNumber;
                }
            }
            if (selectedTotalPriceOption) {
                if (selectedTotalPriceOption === "startWith") {
                    data.total_priceStartWith = value.total_priceStartWith;
                } else if (selectedTotalPriceOption === "endWith") {
                    data.total_priceEndWith = value.total_priceEndWith;
                } else if (selectedTotalPriceOption === "between") {
                    data.total_priceStartFrom = value.total_priceStartFrom;
                    data.total_priceEndFrom = value.total_priceEndFrom;
                } else if (selectedTotalPriceOption === "chef") {
                    data.total_priceLineNumber = value.total_priceLineNumber;
                }
            }
            if (selectedDateOption) {
                if (selectedDateOption === "startWith") {
                    data.dateStartWith = value.dateStartWith;
                } else if (selectedDateOption === "endWith") {
                    data.dateEndWith = value.dateEndWith;
                } else if (selectedDateOption === "between") {
                    data.dateStartFrom = value.dateStartFrom;
                    data.dateEndFrom = value.dateEndFrom;
                } else if (selectedDateOption === "chef") {
                    data.dateLineNumber = value.dateLineNumber;
                }
            }
            if (selectedTimeOption) {
                if (selectedTimeOption === "startWith") {
                    data.timeStartWith = value.timeStartWith;
                } else if (selectedTimeOption === "endWith") {
                    data.timeEndWith = value.timeEndWith;
                } else if (selectedTimeOption === "between") {
                    data.timeStartFrom = value.timeStartFrom;
                    data.timeEndFrom = value.timeEndFrom;
                } else if (selectedTimeOption === "chef") {
                    data.timeLineNumber = value.timeLineNumber;
                }
            }
            if (selectedMenuItemsOption) {
                if (selectedMenuItemsOption === "startWith") {
                    data.menuItemsStartWith = value.menuItemsStartWith;
                } else if (selectedMenuItemsOption === "endWith") {
                    data.menuItemsEndWith = value.menuItemsEndWith;
                } else if (selectedMenuItemsOption === "between") {
                    data.menuItemsStartFrom = value.menuItemsStartFrom;
                    data.menuItemsEndFrom = value.menuItemsEndFrom;
                } else if (selectedMenuItemsOption === "chef") {
                    data.menuItemsLineNumber = value.menuItemsLineNumber;
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
                    return {
                        ...val, restaurantAddress: apiResponse?.data?.data.restaurantAddress,
                        restaurantName: apiResponse?.data?.data?.restaurantName,
                        receiptNumber: apiResponse?.data?.data?.receiptNumber,
                        total_price: apiResponse?.data?.data?.total_price,
                        date: apiResponse?.data?.data?.date,
                        menuItems: JSON.stringify(apiResponse?.data?.data.menuItems),
                        time: apiResponse?.data?.data?.time,

                    };
                });
                setValue((prev) => ({
                    ...prev, restaurantAddress: apiResponse?.data?.data?.restaurantAddress,
                    restaurantName: apiResponse?.data?.data?.restaurantName,
                    receiptNumber: apiResponse?.data?.data?.receiptNumber,
                    total_price: apiResponse?.data?.data?.total_price,
                    date: apiResponse?.data?.data?.date,
                    restaurantId: resId,
                    menuItems: apiResponse?.data?.data?.menuItems,
                    time: apiResponse?.data?.data?.time
                }))
                SuccessMessage(apiResponse?.data?.message);

            } else {
                ErrorMessage(apiResponse?.data?.message);
                seInput((val) => {
                    return {
                        ...val, restaurantAddress: "", restaurantName: "", receiptNumber: "",
                        total_price: "",
                        menuItems: null,
                        date: "",
                        time: ""
                    };
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

    return (
        <Dialog
            open={open}
            sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        width: "100%",
                        maxWidth: "80%",
                        borderRadius: "30px",
                    },
                },
            }} aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <div className="page_contclass">


                {loader && <ApiLoder />}
                <div className="inner-main-content" >
                    <div className="modal-content modelcustomstyle " style={{ padding: '15px' }}>
                        <div className="modal-header p-40 border-bottom-0 position-relative justify-content-center">
                            <div className="modelheading text-center">
                                <h1 className="modal-title" id="exampleModalLabel">
                                    Restaurant Upload
                                </h1>
                                <button style={{ fontSize: '15px' }}
                                    type="button"
                                    className="btn-close position-absolute top-50 end-0"
                                    onClick={(e) => handleclose(e)}
                                />
                                <p>Please enter Restaurant details</p>

                            </div>


                        </div>
                    </div>
                    <div className="contentdivbox tablecard gap-4 d-flex" style={{ margin: '10px', padding: '5px' }}>
                        <div className="contentdivbox_content flex-grow-1 d-flex flex-column gap-3 contentdivbox_contentnew">
                            <div className="d-flex flexcustom gap-3 flex-wrap">
                                <div className="resturant-upload-top mb-20" >
                                    <div className="upload-btn-sec d-flex justify-content-end gap-3 align-items-center" >

                                        <div className="col-lg-12 col-md-12 col-12 mb-3 " style={{ marginTop: "13px", width: '250px', marginLeft: '540px' }}>
                                            <select
                                                className="form-select"
                                                aria-label="Default select example"
                                                onChange={handleChange}
                                                value={resId}
                                                name="restaurantId"
                                            >

                                                <option value="">Select Restaurant</option>
                                                {logoList?.map((val, i) => (
                                                    <option value={val._id} key={i}>{val.name}</option>
                                                ))}
                                            </select>
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
                                                Upload Receipt
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
                                                        <input type="text" className="form-control" value={input?.restaurantName} disabled />
                                                        <div className="error">
                                                            {simpleValidator.current.message(
                                                                "Restaurant Name",
                                                                input?.restaurantName,
                                                                "required"
                                                            )}

                                                        </div>
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

                                                            <input type='text' value={input?.restaurantAddress} className="form-control" disabled />
                                                            <div className="error">
                                                                {simpleValidator.current.message(
                                                                    "Restaurant Address",
                                                                    input?.restaurantAddress,
                                                                    "required"
                                                                )}
                                                            </div>
                                                        </div>
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
                                                <div className="col-lg-5 mb-3">
                                                    <div className="form-group">
                                                        <div className="col-lg-12 col-md-6 col-12 mb-3">
                                                            <label htmlFor="">Receipt Number </label>

                                                            <input type='text' value={input?.receiptNumber} className="form-control" disabled />
                                                            <div className="error">
                                                                {simpleValidator.current.message(
                                                                    "Restaurant Number",
                                                                    input?.receiptNumber,
                                                                    "required"
                                                                )}
                                                            </div>
                                                        </div>
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
                                                                    name="receiptNumber"
                                                                    value={key}
                                                                    checked={selectedReceiptNumberOption === key}
                                                                    onChange={(e) =>
                                                                        setSelecteReceiptNumberOption(e.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* Dynamic Input */}
                                                <div className="col-lg-12 mb-3">
                                                    {renderInputField(selectedReceiptNumberOption, "receiptNumber")}
                                                </div>
                                                <div className="col-lg-5 mb-3">
                                                    <div className="form-group">
                                                        <div className="col-lg-12 col-md-6 col-12 mb-3">
                                                            <label htmlFor="">Total Price </label>

                                                            <input type='text' value={input?.total_price} className="form-control" disabled />
                                                            <div className="error">
                                                                {simpleValidator.current.message(
                                                                    "Total Price",
                                                                    input?.total_price,
                                                                    "required"
                                                                )}
                                                            </div>
                                                        </div>
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
                                                                    name="total_price"
                                                                    value={key}
                                                                    checked={selectedTotalPriceOption === key}
                                                                    onChange={(e) =>
                                                                        setSelecteTotalPriceOption(e.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mb-3">
                                                    {renderInputField(selectedTotalPriceOption, "total_price")}
                                                </div>
                                                <div className="col-lg-5 mb-3">
                                                    <div className="form-group">
                                                        <div className="col-lg-12 col-md-6 col-12 mb-3">
                                                            <label htmlFor="">Date</label>

                                                            <input type='text' value={input?.date} className="form-control" disabled />
                                                            <div className="error">
                                                                {simpleValidator.current.message(
                                                                    "Date",
                                                                    input?.date,
                                                                    "required"
                                                                )}
                                                            </div>
                                                        </div>
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
                                                                    name="date"
                                                                    value={key}
                                                                    checked={selectedDateOption === key}
                                                                    onChange={(e) =>
                                                                        setSelecteDateOption(e.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mb-3">
                                                    {renderInputField(selectedDateOption, "date")}
                                                </div>
                                                <div className="col-lg-5 mb-3">
                                                    <div className="form-group">
                                                        <div className="col-lg-12 col-md-6 col-12 mb-3">
                                                            <label htmlFor="">Time</label>

                                                            <input type='text' value={input?.time} className="form-control" disabled />
                                                            <div className="error">
                                                                {simpleValidator.current.message(
                                                                    "Time",
                                                                    input?.time,
                                                                    "required"
                                                                )}
                                                            </div>
                                                        </div>
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
                                                                    name="time"
                                                                    value={key}
                                                                    checked={selectedTimeOption === key}
                                                                    onChange={(e) =>
                                                                        setSelecteTimeOption(e.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mb-3">
                                                    {renderInputField(selectedTimeOption, "time")}
                                                </div>
                                                <div className="col-lg-5 mb-3">
                                                    <div className="form-group">
                                                        <div className="col-lg-12 col-md-6 col-12 mb-3">
                                                            <label htmlFor="">Menu Items</label>

                                                            <input type='text' value={input?.menuItems} className="form-control" disabled />
                                                            <div className="error">
                                                                {simpleValidator.current.message(
                                                                    "MenuItems",
                                                                    input?.menuItems,
                                                                    "required"
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-7 mt-2">
                                                    <div className="d-flex gap-2 resturant-radio-btn">
                                                        {Object.entries(menuLabels).map(([key, label]) => (
                                                            <div
                                                                key={key}
                                                                className="d-flex gap-2 align-items-center"
                                                            >
                                                                <label>{label}</label>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="menuItems"
                                                                    value={key}
                                                                    checked={selectedMenuItemsOption === key}
                                                                    onChange={(e) =>
                                                                        setSelecteMenuItemsOption(e.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mb-3">
                                                    {renderInputField(selectedMenuItemsOption, "menuItems")}
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
                </div>
            </div>
        </Dialog>
    )
}

export default AddReceiptConfig