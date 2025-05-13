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
import AddEditnfc from "./AddEditnfc";

export default function NfcTrack() {
  const [open, setOpen] = useState(false);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [logoList, setLogoList] = useState([]);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const LogoListAPI = async () => {
    setLoader(true);
    try {
      let query = { type: "nfc" };
      const apiResponse = await callAPI(apiUrls.urlGetAll, query, "GET");
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.length > 0) {
          setLogoList(apiResponse.data.data);
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
  useEffect(() => {
    LogoListAPI();
  }, []);

  const handleDelete = async () => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.urldDelete + `?urlId=${object._id}`,
        {},
        "GET"
      );
      setLoader(false);
      if (response.data.status) {
        const newList = logoList.filter((val) => {
          return val._id !== object._id;
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
  const copyToClipboard = (tt) => {
    navigator.clipboard.writeText(tt ? tt : "No Qr Found !!");
    SuccessMessage("Copy to Clickboard !!");
  };

  return (
    <>
      <div id="page-container" className="page_contclass">
        <Topbar
          Title="Track NFC Url Activity"
          Subtitle="Track NFC Url Activity"
        >
          <Link
            to="#"
            className="creatbtn d-flex align-items-center justify-content-center gap-2"
            onClick={() => {
              setAction("add");
              setOpen(true);
            }}
          >
            <PlushSvg />
            Clone url
          </Link>
        </Topbar>
        <div className="inner-main-content">
          {loder && <ApiLoder />}
          <div className="tablecard mb-30">
            <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
              <h2 className="mb-0">Track NFC Url Activity</h2>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Restaurant Name</th>
                    <th>Copy URL</th>
                    <th>Label</th>
                    <th>Users Visit</th>
                    <th>UnKnown Visit</th>
                    <th>status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logoList !== undefined && logoList?.length > 0
                    ? logoList?.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item?.restaurantDetail?.name}</td>
                        <td>
                          <Link
                            to="#"
                            onClick={() => copyToClipboard(item.url)}
                            style={{ cursor: "pointer" }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M21 8.94C20.9896 8.84813 20.9695 8.75763 20.94 8.67V8.58C20.8919 8.47718 20.8278 8.38267 20.75 8.3L14.75 2.3C14.6673 2.22222 14.5728 2.15808 14.47 2.11C14.4402 2.10576 14.4099 2.10576 14.38 2.11C14.2784 2.05174 14.1662 2.01434 14.05 2H10C9.20435 2 8.44129 2.31607 7.87868 2.87868C7.31607 3.44129 7 4.20435 7 5V6H6C5.20435 6 4.44129 6.31607 3.87868 6.87868C3.31607 7.44129 3 8.20435 3 9V19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H14C14.7956 22 15.5587 21.6839 16.1213 21.1213C16.6839 20.5587 17 19.7956 17 19V18H18C18.7956 18 19.5587 17.6839 20.1213 17.1213C20.6839 16.5587 21 15.7956 21 15V9C21 9 21 9 21 8.94ZM15 5.41L17.59 8H16C15.7348 8 15.4804 7.89464 15.2929 7.70711C15.1054 7.51957 15 7.26522 15 7V5.41ZM15 19C15 19.2652 14.8946 19.5196 14.7071 19.7071C14.5196 19.8946 14.2652 20 14 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V9C5 8.73478 5.10536 8.48043 5.29289 8.29289C5.48043 8.10536 5.73478 8 6 8H7V15C7 15.7956 7.31607 16.5587 7.87868 17.1213C8.44129 17.6839 9.20435 18 10 18H15V19ZM19 15C19 15.2652 18.8946 15.5196 18.7071 15.7071C18.5196 15.8946 18.2652 16 18 16H10C9.73478 16 9.48043 15.8946 9.29289 15.7071C9.10536 15.5196 9 15.2652 9 15V5C9 4.73478 9.10536 4.48043 9.29289 4.29289C9.48043 4.10536 9.73478 4 10 4H13V7C13 7.79565 13.3161 8.55871 13.8787 9.12132C14.4413 9.68393 15.2044 10 16 10H19V15Z"
                                fill="#9A9A9A"
                              />
                            </svg>
                          </Link>
                        </td>
                        <td>{item?.label || "--"}</td>

                        <td>
                          <Link to={`/admin/nfctrack/${item._id}`}>
                            {item.totalUser ? item.totalUser : 0}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/admin/nfctrack/${item._id}`}>
                            {item.totalUnkownUser ? item.totalUnkownUser : 0}
                          </Link>
                        </td>

                        <td>
                          <Link
                            to="#"
                            className={
                              item?.status === "active"
                                ? "clobx greens"
                                : "clobx reds"
                            }
                          >
                            {item?.status}
                          </Link>
                        </td>
                        <td className="text-start">
                          <div className="actionbtn d-flex align-items-center justify-content-end gap-2">
                            <Link
                              to="#"
                              className="editlink"
                              onClick={() => {
                                setAction("edit");
                                setObject(item);
                                setOpen(true);
                              }}
                            >
                              <EditSvg />
                            </Link>
                            <Link
                              to="#"
                              className="trashlink"
                              onClick={() => {
                                setDelOpen(true);
                                setObject(item);
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
      <AddEditnfc
        open={open}
        handleclose={handleclose}
        LogoListAPI={LogoListAPI}
        action={action}
        object={object}
      />
      <HandleDelete
        isOpen={delOpen}
        handleClose={handledelclose}
        handleDelete={handleDelete}
        deleteTitle={"Are you sure delete this Url"}
        loder={loder}
      />
    </>
  );
}
