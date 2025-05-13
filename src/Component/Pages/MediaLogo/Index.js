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
import AddEditMedia from "./AddEditMedia";
import { defaultConfig } from "../../../config";

export default function Index() {
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [loder, setLoader] = useState(false);
  const [logoList, setLogoList] = useState([]);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");

  const LogoListAPI = async () => {
    setLoader(true);
    try {
      let query = {};
      const apiResponse = await callAPI(apiUrls.mediaGetAll, query, "GET");
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

  const handleDelete = async () => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.mediaDelete,
        { _id: object._id },
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

  useEffect(() => {
    LogoListAPI();
  }, []);

  return (
    <>
      <div id="page-container" className="page_contclass">
        <Topbar Title="Media Logo" Subtitle="Media Logo">
          <Link
            to="#"
            onClick={() => {
              setAction("add");
              setOpen(true);
            }}
            className="creatbtn d-flex align-items-center justify-content-center gap-2"
          >
            <PlushSvg />
            Create Media Logo
          </Link>
        </Topbar>
        <div className="inner-main-content">
          {loder && <ApiLoder />}
          <div className="tablecard mb-30">
            <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
              <h2 className="mb-0">Media Logo</h2>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>

                    <th>Logo</th>

                    <th>Status</th>

                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logoList !== undefined && logoList?.length > 0
                    ? logoList?.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item?.name}</td>

                        <td>
                          <figure className="user_pic">
                            <img
                              src={defaultConfig.imagePath + item?.image}
                              className="img-fluid"
                              alt=""
                            />
                          </figure>
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
      <AddEditMedia
        open={open}
        handleclose={handleclose}
        action={action}
        LogoListAPI={LogoListAPI}
        object={object}
      />
      <HandleDelete
        isOpen={delOpen}
        handleClose={handledelclose}
        handleDelete={handleDelete}
        deleteTitle={"Are you sure delete this Logo"}
        loder={loder}
      />
    </>
  );
}
