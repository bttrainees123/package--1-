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
import { Link, NavLink } from "react-router-dom";
import Topbar from "../../../Layout/Topbar";
import AddEditUrl from "./AddEditUrl";

export default function Index() {
  const [open, setOpen] = useState(false);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [logoList, setLogoList] = useState([]);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");

  const LogoListAPI = async () => {
    setLoader(true);
    try {
      let query = { type: "other" };
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

  return (
    <>
      <div id="page-container" className="page_contclass">
        <Topbar Title="Track Url Activity" Subtitle="Track Url Activity">
          <Link
            to="#"
            className="creatbtn d-flex align-items-center justify-content-center gap-2"
            onClick={() => {
              setAction("add");
              setOpen(true);
            }}
          >
            <PlushSvg />
            Create Url
          </Link>
        </Topbar>
        <div className="inner-main-content">
          {loder && <ApiLoder />}
          <div className="tablecard mb-30">
            <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
              <h2 className="mb-0">Track Url Activity</h2>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>URL</th>
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
                        <td>
                          <NavLink
                            activeclassname="active"
                            to={`${item?.url}`}
                            className={"userHistoryLink"}
                            target="blank"
                          >
                            {item?.url}
                          </NavLink>
                        </td>
                        <td>
                          <Link to={`/admin/trackUrlactivity/${item._id}`}>
                            {item.totalUser ? item.totalUser : 0}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/admin/trackUrlactivity/${item._id}`}>
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
      <AddEditUrl
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
