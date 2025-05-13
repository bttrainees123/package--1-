import React, { useEffect, useState } from "react";
import { TablePagination } from "@mui/material";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {
  ApiLoder,
  ErrorMessage,
  HandleDelete,
  SuccessMessage,
} from "../../../helpers/common";
import { DeleteSvg, EditSvg, SearchSvg } from "../../../SvgFile/Index";
import EditRestaurant from "./EditRestaurant";
import QRcode from "./QRcode";
import ReviewList from "./ReviewList";
import { Link, useNavigate } from "react-router-dom";

export default function OutnetworkResturent({ update, logoList, type, TagsListingData, mediaList }) {
  const [loder, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [filter, setFilter] = useState({ search: "" });
  const [restaurantListAPIList, setRestaurantListAPIList] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isQrOpen, setIsQrOpen] = React.useState(false);
  const [Qr, setQr] = React.useState("");
  const [deleteItemId, setDeleteItemId] = useState();
  const [object, setObject] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [TagsData, setTagsData] = useState([])

  const lastIndex = page * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;

  const handleClose = () => {
    setEditOpen(false);
  };
  const tagApi = async () => {
    try {
      let query = {};
      const apiResponse = await callAPI(apiUrls.tagList, query, "GET");
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.length > 0) {
          setTagsData(apiResponse.data.data)
        }
        else {
          setTagsData([])
        }
      } else {
        ErrorMessage(apiResponse?.data?.message)
      }

    } catch (error) {

      ErrorMessage(error?.message)
    }
  }

  const RestaurantListAPI = async (page, rowsPerPage, search) => {
    setLoader(true);
    try {
      let query = {
        search: search,
        page: page ? page : 1,
        limit: rowsPerPage ? rowsPerPage : 10,
        type: type !== "inNetwork" ? "outNetwork" : "inNetwork",
      };
      const apiResponse = await callAPI(apiUrls.restaurantList, query, "GET");
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.rerstaurantList?.length > 0) {
          setRestaurantListAPIList(apiResponse.data.data?.rerstaurantList);
        } else setRestaurantListAPIList([]);
        setPaginatedItems(apiResponse?.data?.data?.count);
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      ErrorMessage(error?.message);
    }
  };

  const handleChangePage = (event, newPage) => {
    RestaurantListAPI(newPage + 1, rowsPerPage, filter.search);
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    RestaurantListAPI(pageNo, parseInt(event.target.value, 10), filter.search);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };

  const handleSearchFilter = (e) => {
    setPage(1);
    setFilter((val) => {
      return { ...val, search: e.target.value };
    });
  };
  useEffect(() => {
    tagApi()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      RestaurantListAPI(page, rowsPerPage, filter.search);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, [filter.search, update]);

  const handleOpenDelete = (id) => {
    setDeleteItemId(id);
    setIsDeleteOpen(true);
  };

  const handleSubmitApi = (type, intype) => {
    let pageNo = 1;
    RestaurantListAPI(pageNo, rowsPerPage, filter.search);
    if (type === "inNetwork" && intype === "outNetwork" || type === "outNetwork" && intype === "inNetwork") {
      window.location.reload();
    }
    setPage(pageNo);
  };

  const handleDeleteApi = async () => {
    try {
      setLoader(true);
      const apiResponse = await callAPI(apiUrls.restaurantDelete, {}, "POST", {
        id: deleteItemId,
        is_deleted: 1,
      });
      if (apiResponse.data.status) {
        SuccessMessage(apiResponse.data.message);
        RestaurantListAPI(page, rowsPerPage, filter.search);
        setIsDeleteOpen(false);
        setDeleteItemId();
        setLoader(false);
        setPaginatedItems(paginatedItems - 1);
      } else {
        ErrorMessage(apiResponse.data.message);
        setLoader(false);
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

  const navigate = useNavigate();

  const NavigateTo = (item) => {
    localStorage.setItem("name", JSON.stringify(item?.name));
    navigate(`/admin/restaurant/menu/${item?._id}`)

  };
  return (
    <>
      {loder && <ApiLoder />}
      <div className="tablecard mb-30">
        <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
          <h2 className="mb-0">
            {type !== "inNetwork" ? "Out of Network" : "In network"}
          </h2>
          <div className="d-flex align-items-center serchbx">
            <span className="">
              <SearchSvg />
            </span>
            <input
              type="search"
              className="form-control"
              placeholder="Search Restaurant..."
              onChange={handleSearchFilter}
            />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Restaurant Name</th>
                <th>Address</th>
                <th>OCR logic</th>
                <th>Total Reviews</th>
                <th>QR Code</th>

                {type === "inNetwork" && <th>Menu builder</th>}
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurantListAPIList !== undefined &&
                restaurantListAPIList?.length > 0
                ? restaurantListAPIList?.map((item, i) => (
                  <tr key={i}>
                    <td>{firstIndex + i + 1}</td>
                    <td>{item?.name}</td>
                    <td>{item?.receiptAddress}</td>
                    <td>
                      <span style={{ color: item.isParser ? "green" : "red" }}>{item.isParser ? "Has receipt" : "Needs receipt"}</span>
                    </td>
                    <td>
                      <Link
                        to="#"
                        className="textblue"
                        onClick={() => {
                          if (item?.reviewCount > 0) {
                            setObject(item);
                            setReviewOpen(true);
                          }
                        }}
                      >
                        {item?.reviewCount}
                      </Link>
                    </td>
                    <div className="meetingsec d-flex align-items-center gap-2">
                      <Link style={{ cursor: "pointer" }}
                        to="#"
                        onClick={() => {
                          setIsQrOpen(true);
                          setQr(item.qrImage);
                        }}
                      >
                        <img
                          src="/image/scancode.png"
                          className="img-fluid"
                          alt=""
                        />
                      </Link>
                      <Link
                        to="#"
                        onClick={() => copyToClipboard(item.qrImage)}
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
                    </div>

                    {type === "inNetwork" && <td><img alt='' src='/image/view.png' style={{ cursor: "pointer" }} onClick={(() => NavigateTo(item))} className='img-fluid' /></td>}
                    <td className="text-start">
                      <div className="actionbtn d-flex align-items-center justify-content-end gap-2">

                        <Link
                          to="#"
                          className="editlink"
                          onClick={() => {
                            setObject(item);
                            setEditOpen(true);
                          }}
                        >
                          <EditSvg />
                        </Link>

                        <Link
                          to="#"
                          className="trashlink"
                          onClick={() => {
                            handleOpenDelete(item?._id);
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
                    <td colSpan="6">
                      <div className="no_record_text">No Record Found</div>
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
      <ReviewList
        ReviewList={object}
        open={reviewOpen}
        handleClose={() => setReviewOpen(false)}
        status={true}
      />
      <QRcode
        open={isQrOpen}
        handleClose={() => {
          setIsQrOpen(false);
        }}
        qrImage={Qr}
      />
      {deleteItemId !== undefined && (
        <HandleDelete
          isOpen={isDeleteOpen}
          handleClose={() => {
            setIsDeleteOpen(false);
          }}
          handleDelete={handleDeleteApi}
          deleteTitle={"Are you sure delete this Restaurant"}
          loder={loder}
        />
      )}
      <EditRestaurant
        open={editOpen}
        type={type}
        TagsListingData={TagsData}
        handleClose={handleClose}
        handleSubmitApi={handleSubmitApi}
        object={object}
        logoList={logoList}
        mediaList={mediaList}
      />
    </>
  );
}
