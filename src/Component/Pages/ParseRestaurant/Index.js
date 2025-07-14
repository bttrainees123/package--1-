import React, { useEffect, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import {
    ApiLoder,
    ErrorMessage,
    HandleDelete,
    SuccessMessage,
} from "../../../helpers/common";
import { apiUrls } from "../../../utils/apiUrls";
import { DeleteSvg, EditSvg, PlushSvg } from "../../../SvgFile/Index";
import { Link } from "react-router-dom";
import Topbar from "../../../Layout/Topbar";
import AddReceiptConfig from "./AddReceiptConfig";
import { defaultConfig } from "../../../config";
const Index = () => {
    const [open, setOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);
    const [loder, setLoader] = useState(false);
    const [logoList, setLogoList] = useState([]);
    const [action, setAction] = useState("");
    const [object, setObject] = useState("");
    const [restaurantId, setRestaurantId] = useState("")
    const [resList, setResList] = useState([])

    const LogoListAPI = async () => {
        setLoader(true);
        try {
            let query = { _id: restaurantId };
            const apiResponse = await callAPI(apiUrls.getReciptConfig, query, "GET");
            if (apiResponse?.data?.status === true) {
                if (apiResponse?.data?.data?.length > 0) {
                    setLogoList(apiResponse?.data?.data);
                } else {
                    setLogoList([]);
                }
            } else {
                ErrorMessage(apiResponse?.data?.message);
            }
            setLoader(false);
        } catch (error) {
            setLoader(false);
            ErrorMessage(error?.message);
        }
    };

    const handleclose = () => {
        setOpen(false);
    };
    const handledelclose = () => {
        setDelOpen(false);
    };

    const handleDelete = async () => {
        setLoader(true);
        try {
            const response = await callAPI(
                apiUrls.deleteReciptConfig,
                { _id: object },
                "GET"
            );
            setLoader(false);
            if (response.data.status) {
                const newList = logoList.filter((val) => {
                    return val._id !== object;
                });
                setLogoList(newList);
                SuccessMessage(response.data.message);
                setDelOpen(false);
            } else {
                ErrorMessage(response.data.message);
            }
        } catch (error) {
            setLoader(false);
            ErrorMessage(error.message);
        }
    };

    useEffect(() => {
        LogoListAPI();
    }, [restaurantId]);

    const handleChange = (e) => {
        setRestaurantId(e?.target?.value)
    };

    const RestaurantListAPI = async () => {
        try {
            const apiResponse = await callAPI(apiUrls.getRestaurantName, {}, "GET");
            if (apiResponse?.data?.status) {
                if (apiResponse?.data?.data?.length > 0) {
                    setResList(apiResponse?.data?.data);
                } else {
                    setLogoList([]);
                }
            }
        } catch (error) { }
    };

    useEffect(() => {
        RestaurantListAPI();
    }, []);
    return (
        <>
            <div id="page-container" className="page_contclass">
                <Topbar Title="Receipt Config" Subtitle="Receipt Config">
                    <Link
                        to="#"
                        onClick={() => {
                            setAction("add");
                            setOpen(true);
                        }}
                        className="creatbtn d-flex align-items-center justify-content-center gap-2"
                    >
                        <PlushSvg />
                        Parse Restaurant
                    </Link>
                </Topbar>
                <div className="inner-main-content">
                    {loder && <ApiLoder />}
                    <div className="tablecard mb-30">
                        <div className="tableheader d-flex align-items-center justify-content-between boderbtn" style={{padding: '0px 16px'}}>
                            <h2 className="mb-0">Receipt Config</h2>
                            <div className="col-lg-12 col-md-12 col-12 mb-3 " style={{ marginTop: "12px", width: '250px', marginLeft: '540px' }}>
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    onChange={handleChange}
                                    value={restaurantId}
                                    name="restaurantId"
                                >

                                    <option value="">Select Restaurant</option>
                                    {resList?.map((val, i) => (
                                        <option value={val?._id} key={i}>{val?.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Restaurant Name</th>

                                        <th>Restaurant Address</th>

                                        <th>Receipt Number</th>
                                        <th>Total Price</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Menu Items</th>

                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logoList !== undefined && logoList?.length > 0
                                        ? logoList?.map((item, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{item?.restaurantName}</td>
                                                <td>{item?.restaurantAddress}</td>
                                                <td>{item?.receiptNumber}</td>
                                                <td>{item?.total_price}</td>
                                                <td>{item?.date}</td>
                                                <td>{item?.time}</td>
                                                <td>{item?.menuItems?.map((it) => it?.menu).join(", ")}</td>

                                                <td className="text-start">
                                                    <div className="actionbtn d-flex align-items-center justify-content-center">
                                                        <Link
                                                            to="#"
                                                            className="trashlink"
                                                            onClick={() => {
                                                                setDelOpen(true);
                                                                setObject(item?._id);
                                                            }}
                                                        >
                                                            <DeleteSvg />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                        : !loder && (
                                            <tr>
                                                <td colSpan="5">
                                                    <div className="no_record_text">
                                                        No Record Found
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <AddReceiptConfig
                open={open}
                handleclose={handleclose}
                LogoListAPI={LogoListAPI}
            />
            <HandleDelete
                isOpen={delOpen}
                handleClose={handledelclose}
                handleDelete={handleDelete}
                deleteTitle={"Are you sure delete this Logo"}
                loder={loder}
            />
        </>
    )
}

export default Index