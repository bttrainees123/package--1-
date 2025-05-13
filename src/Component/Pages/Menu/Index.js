import React, { useEffect, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import {
  ApiLoder,
  ErrorMessage,
  HandleDelete,
  SuccessMessage,
} from "../../../helpers/common";
import { apiUrls } from "../../../utils/apiUrls";
import {
  DeleteSvg,
  EditSvg,
  PlushSvg,
  SearchSvg,
} from "../../../SvgFile/Index";
import { Link, useParams } from "react-router-dom";
import Topbar from "../../../Layout/Topbar";
import AddandEditMenu from "./AddandEditMenu";
import { defaultConfig } from "../../../config";
import { TablePagination } from "@mui/material";
import AddCatagory from "../Catagory/AddCatagory";

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
  const [search, setsearch] = useState("");
  const [cat, setCat] = useState([]);
  const [TagsData, setTagsData] = useState([]);
  const [opens, setOpens] = useState(false);

  const pram = useParams();

  const LogoListAPI = async (page, rowsPerPage, search) => {
    setLoader(true);
    try {
      let query = {
        search: search,
        page: page ? page : 1,
        limit: rowsPerPage ? rowsPerPage : 10,
        restaurantId: pram.id,
      };
      const apiResponse = await callAPI(
        apiUrls.restaurantMenuListingAdmin,
        query,
        "GET"
      );
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.menuData?.length > 0) {
          setLogoList(apiResponse.data.data?.menuData);
        } else setLogoList([]);
        setPaginatedItems(apiResponse?.data?.data?.total);
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

  const handleDelete = async () => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.deleteRestaurantMenuAdmin + `/${object._id}`,
        {},
        "GET"
      );
      setLoader(false);
      if (response.data.status) {
        LogoListAPI(page, rowsPerPage, search);
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

  const handleChangePage = (event, newPage) => {
    LogoListAPI(newPage + 1, rowsPerPage, search);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    LogoListAPI(pageNo, parseInt(event.target.value, 10), search);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };

  const handleSearchFilter = (e) => {
    setPage(1);
    setsearch(e.target.value);
  };

  const CatListAPI = async () => {
    try {
      let query = {
        restaurantId: pram.id,
      };
      const apiResponse = await callAPI(
        apiUrls.categoryListOfRestaurant,
        query,
        "GET"
      );
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.length > 0) {
          setCat(apiResponse.data.data);
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
    CatListAPI();
    tagApi();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      LogoListAPI(page, rowsPerPage, search);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const Name = JSON.parse(localStorage.getItem("name"));

  const Apiload = () => {
    LogoListAPI(page, rowsPerPage, search);
  };

  return (
    <>
      <div id="page-container" className="page_contclass">
        <Topbar Title="Menu" Subtitle="Menu">
          <Link
            to="#"
            onClick={() => {
              setOpens(true);
            }}
            className="creatbtn gap-2"
          >
            <PlushSvg />
            Create Category
          </Link>
        </Topbar>
        <div className="inner-main-content">
          {loder && <ApiLoder />}
          <div className="tablecard mb-30">
            <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
              <h2 className="mb-0">{Name ? Name : "---"}</h2>

              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center serchbx">
                  <span className="">
                    <SearchSvg />
                  </span>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search Menu..."
                    onChange={handleSearchFilter}
                  />
                </div>
                <Link
                  to="#"
                  onClick={() => {
                    setAction("add");
                    setOpen(true);
                  }}
                  className="creatbtn d-flex align-items-center justify-content-center gap-2"
                >
                  <PlushSvg />
                  Create menu item
                </Link>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Restaurant</th>
                    <th>Catagory</th>
                    <th>Status</th>

                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logoList !== undefined && logoList?.length > 0
                    ? logoList?.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item?.itemname}</td>
                        <td>
                          <figure className="user_pic">
                            <img
                              src={
                                defaultConfig.imagePath + item?.profileImage
                              }
                              className="img-fluid"
                              alt=""
                            />
                          </figure>
                        </td>
                        <td>{Name ? Name : "---"}</td>
                        <td>{item?.category?.name}</td>
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
        open={opens}
        handleclose={() => setOpens(false)}
        LogoListAPI={CatListAPI}
        restaurantId={pram.id}
        LogoList={cat}
        Name={Name}
      />
      <AddandEditMenu
        open={open}
        handleclose={handleclose}
        action={action}
        LogoListAPI={Apiload}
        object={object}
        cat={cat}
        resturentId={pram.id}
        logoList={logoList}
        TagsListingData={TagsData}
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
