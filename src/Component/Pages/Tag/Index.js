import React, { useEffect, useRef, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import {
  ApiLoder,
  ErrorMessage,
  HandleDelete,
  HandleDeleteAll,
  SuccessMessage,
  trimText,
} from "../../../helpers/common";
import { apiUrls } from "../../../utils/apiUrls";
import {
  DeleteSvg,
  EditSvg,
  PlushSvg,
  SearchSvg,
} from "../../../SvgFile/Index";
import { Link } from "react-router-dom";
import Topbar from "../../../Layout/Topbar";
import AddTag from "./AddTag";
import { Dialog, TablePagination } from "@mui/material";
// import moment from "moment";
export default function Index() {
  const [open, setOpen] = useState(false);
  const [loder, setLoader] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [logoList, setLogoList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [action, setAction] = useState("");
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({ search: "" });
  const [idArr, setIdArr] = useState([])
  // const [IsSelectBtn, setIsSelectBtn] = useState(true)
  const arrayRef = useRef(idArr);
  const lastIndex = page * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;

  const LogoListAPI = async (page, rowsPerPage, search) => {
    setLoader(true);
    try {
      let query = {
        search: search,
        page: page ? page : 1,
        limit: rowsPerPage ? rowsPerPage : 10,
      };
      const apiResponse = await callAPI(apiUrls.tagListing, query, "GET");
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.tagData?.length > 0) {
          setLogoList(apiResponse.data.data?.tagData);
        } else {
          setLogoList([]);
        }
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

  const handleChangePage = (event, newPage) => {
    LogoListAPI(newPage + 1, rowsPerPage, filter.search);
    setPage(newPage + 1);
    setIdArr([])
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    LogoListAPI(pageNo, parseInt(event.target.value, 10), filter.search);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };

  const handleChangeRowsPerPageDelete = () => {
    let pageNo = 1;
    LogoListAPI(pageNo, 10, filter.search);
    setRowsPerPage(10);
    setPage(pageNo);
  };

  // const handleSelectAll = () => {
  //   setIsSelectBtn(false)
  //   setIdArr(logoList.map(it => it._id));
  // };

  // const handleUnselectAll = () => {
  //   setIsSelectBtn(true)
  //   setIdArr([]);
  // };

  const handleSearchFilter = (e) => {
    setPage(1);
    setFilter((val) => {
      return { ...val, ["search"]: e.target.value };
    });
  };

  const handledelclose = () => {
    setDelOpen(false);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      LogoListAPI(page, rowsPerPage, filter.search);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [filter.search]);

  const handleCheckbox = (val, id) => {
    if (val.target.checked) {
      setIdArr([...idArr, id])
    }
    else {
      setIdArr(idArr.filter(it => it !== id))
    }
  }

  useEffect(() => {
    arrayRef.current = idArr;
    console.log("Updated array: ", arrayRef.current);
  }, [idArr]);

  const handleDeleteAll = async () => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.deleteMultipleTags, {}, "POST", { ids: idArr }
      );
      setLoader(false)
      if (response.data.status) {
        const newList = logoList.filter((it) => !idArr.includes(it._id))
        setLogoList(newList)
        SuccessMessage(response.data.message);
        setDeleteOpen(false)
        setIdArr([])
        handleChangeRowsPerPageDelete()
      }
      else {
        ErrorMessage(response.data.message);
      }
    }
    catch (error) {
      setLoader(false);
      ErrorMessage(error.message);
    }
  }

  const toggleAll = (checked) => {
    setIdArr(checked ? logoList.map(it => it._id) : []);
  };

  const isAllSelected = logoList.length === 0 ? false : logoList.length === idArr.length

  const handleDelete = async () => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.deleteTag + `?tagId=${object._id}`,
        {},
        "GET"
      );
      setLoader(false);
      if (response.data.status) {
        const newList = logoList.filter((val) => {
          return val._id !== object._id;
        });
        setLogoList(newList);
        LogoListAPI(page, rowsPerPage, filter.search);
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
        <Topbar Title="Menu item tags" Subtitle="Menu item tags">
        </Topbar>
        <div className="inner-main-content">
          {loder && <ApiLoder />}
          <div className="tablecard mb-30">
            <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
              <h2 className="mb-0" >Menu item tags</h2>
              <div style={{ marginLeft: '450px' }}>
                {idArr.length > 0 && <><button type="button" className="btn btn-danger btn-sm" onClick={() => {
                  setDeleteOpen(true)
                }}>Delete ({idArr.length})</button></>}
                {/* {IsSelectBtn ? <button type="button" className="btn btn-info btn-sm " style={{ marginLeft: '80px' }} onClick={handleSelectAll}>Select All</button> : <button type="button" className="btn btn-info btn-sm" style={{ marginLeft: '10px' }} onClick={handleUnselectAll}>Unselect All</button>} */}
              </div>
              <div className="d-flex align-items-center serchbx">
                <span className="">
                  <SearchSvg />
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search tag..."
                  onChange={handleSearchFilter}
                />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th><> <input style={{ marginRight: '15px', width: '18px', height: '18px', border: '2px solid rgb(143, 139, 139)' }}
                      className="form-check-input"
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => toggleAll(e.target.checked)}
                    /></></th>
                    {/* <th>#</th> */}
                    <th>Tag</th>
                    <th>Tag Alias</th>
                    {/* <th>Most Visited</th> */}
                    {/* <th>Created Date And Time</th> */}
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logoList !== undefined && logoList?.length > 0
                    ? logoList?.map((item, i) => (
                      <tr key={i}>
                        <td><input type="checkbox" checked={idArr.includes(item._id)} onChange={(e) => handleCheckbox(e, item._id)} className="form-check-input"
                          style={{ marginRight: '10px', width: '18px', height: '18px', border: '2px solid rgb(143, 139, 139)' }} />  {firstIndex + i + 1}</td>
                        {/* <td>{i + 1}</td> */}
                        <td>{item?.tag}</td>
                        {/* <td>{item.Visited ? item.Visited : 0} Time</td> */}
                        {/* <td>
                          {moment(item?.createdAt).format("MM/DD/YYYY")} |{" "}
                          {moment(item?.createdAt).format("hh:mm A")}
                        </td> */}
                        <td>
                          <div className="badge-container">
                            {item?.tagAlias?.map((item1, index) => (
                              <div className="menu-badge" key={index}>
                                {item1.length < 50 ? (`${item1}`) : (trimText(item1, 50))}
                              </div>
                            ))}
                          </div>
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
                            {!idArr.includes(item._id) &&
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
                            }
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
      <AddTag open={open} handleclose={handleclose} LogoListAPI={LogoListAPI} action={action} object={object} />
      <HandleDelete
        isOpen={delOpen}
        handleClose={handledelclose}
        handleDelete={handleDelete}
        deleteTitle={"Are you sure delete this tag"}
        loder={loder}
      />
      <Dialog
        open={deleteOpen}
        fullWidth={true}
        maxWidth={"xs"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="modal-dialog modal-dialog-centered model472">
          <div className="modal-content modelcustomstyle">
            <div className="modal-header p-0 border-bottom-0 position-relative justify-content-center"></div>
            <div className="modal-body px-0 py-0">
              <figure className="logout mb-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  id="sign-out-alt"
                >
                  <path
                    fill="#6563FF"
                    d="M12.59,13l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-4-4a1,1,0,1,0-1.42,1.42L12.59,11H3a1,1,0,0,0,0,2ZM12,2A10,10,0,0,0,3,7.55a1,1,0,0,0,1.8.9A8,8,0,1,1,12,20a7.93,7.93,0,0,1-7.16-4.45,1,1,0,0,0-1.8.9A10,10,0,1,0,12,2Z"
                  ></path>
                </svg>
              </figure>
              <div className="modelheading text-center mt-3 mb-4">
                <h1 className="modal-title" id="exampleModalLabel">
                  Delete
                </h1>
                <p>Are you sure want to Delete All ?</p>
              </div>
            </div>
            <div className="modal-footer p-0 border-top-0 justify-content-center gap-3">
              <button
                disabled={loder}
                type="button"
                onClick={handleDeleteAll}
                className="btndarkblue modalfooterpadding"
              >
                Yes
                {loder && (
                  <i
                    className="fa fa-spinner fa-spin"
                    style={{ marginLeft: "10px" }}
                  ></i>
                )}
              </button>
              <button
                type="button"
                className="btndarkblue-outline modalfooterpadding"
                onClick={handleDeleteClose}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}


















































































//10: 00 --- 01: 30 //
//Api integretation
//After Delete all reflected on app
//Adding custome data for Api testing
//change api GET to POST and fix error
//Pagination is not working on delete fix
//Single delete handle on same page
