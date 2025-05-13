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
import AddCatagory from "./AddCatagory";
import { TablePagination } from "@mui/material";

export default function Index() {
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [loder, setLoader] = useState(false);
  const [logoList, setLogoList] = useState([]);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [restaurantListAPIList, setRestaurantListAPIList] = useState([]);

  const LogoListAPI = async (page, rowsPerPage) => {
    setLoader(true);
    try {
      let query = {
        page: page ? page : 1,
        limit: rowsPerPage ? rowsPerPage : 10,
      };
      const apiResponse = await callAPI(apiUrls.listFoodCategory, query, "GET");
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.pageinatedResult?.length > 0) {
          setLogoList(apiResponse.data.data.pageinatedResult);
        } else {
          setLogoList([]);
        }
        setPaginatedItems(apiResponse?.data?.data?.totalCount);
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      ErrorMessage(error?.message);
    }
  };


  const RestaurantListAPI = async () => {

    try {
      let query = {
        page: 1,
        limit: 10000,
        type: "inNetwork",
      };
      const apiResponse = await callAPI(apiUrls.restaurantList, query, "GET");
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.rerstaurantList?.length > 0) {
          setRestaurantListAPIList(apiResponse.data.data?.rerstaurantList);
        } else setRestaurantListAPIList([]);
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }

    } catch (error) {

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
        apiUrls.deleteFoodCategory + `/${object._id}`,
        {},
        "GET"
      );
      setLoader(false);
      if (response.data.status) {
        LogoListAPI(page, rowsPerPage)
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
    RestaurantListAPI();
  }, []);

  const handleChangePage = (event, newPage) => {
    LogoListAPI(newPage + 1, rowsPerPage);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    LogoListAPI(pageNo, parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };

  return (
    <>
      <div id="page-container" className="page_contclass">
        <Topbar Title="Category" Subtitle="Category">
          <Link
            to="#"
            onClick={() => {
              setAction("add");
              setOpen(true);
            }}
            className="creatbtn d-flex align-items-center justify-content-center gap-2"
          >
            <PlushSvg />
            Create Category
          </Link>
        </Topbar>
        <div className="inner-main-content">
          {loder && <ApiLoder />}
          <div className="tablecard mb-30">
            <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
              <h2 className="mb-0">Category</h2>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Restaurant</th>
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
                        <td>{item?.restauranData?.name}</td>
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
              <div className="d-flex align-items-center justify-content-end bottom_nav">
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <TablePagination
                      rowsPerPageOptions={[10, 15, 25, 100]}
                      component="div"
                      count={paginatedItems}
                      rowsPerPage={rowsPerPage}
                      page={page - 1}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddCatagory
        open={open}
        handleclose={handleclose}
        action={action}
        LogoListAPI={LogoListAPI}
        object={object}
        restaurantListAPIList={restaurantListAPIList}
      />
      <HandleDelete
        isOpen={delOpen}
        handleClose={handledelclose}
        handleDelete={handleDelete}
        deleteTitle={"Are you sure delete this Category"}
        loder={loder}
      />
    </>
  );
}
