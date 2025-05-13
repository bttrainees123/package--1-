import React, { useEffect, useState } from 'react'
import { ErrorMessage, HandleDelete, SuccessMessage } from '../../../helpers/common';
import { callAPI } from '../../../utils/apiUtils';
import { apiUrls } from '../../../utils/apiUrls';
import { defaultConfig } from '../../../config';
import moment from 'moment-timezone';
import { TablePagination } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Review_History({ ApiCall }) {
  const [loder, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [filter, setFilter] = useState({ search: "" });
  const [restaurantListAPIList, setRestaurantListAPIList] = useState([]);
  const [deleteItemId, setDeleteItemId] = useState();
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const lastIndex = page * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;

  const RestaurantListAPI = async (page, rowsPerPage, search) => {
    ApiCall(true)
    try {
      let query = { search: search, page: page ? page : 1, limit: rowsPerPage ? rowsPerPage : 10 };
      const apiResponse = await callAPI(apiUrls.reviewHistory, query, "GET");
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.rerstaurantList?.length > 0) {
          setRestaurantListAPIList(apiResponse.data.data?.rerstaurantList)
        } else setRestaurantListAPIList([])
        setPaginatedItems(apiResponse?.data?.data?.count)
      } else {
        ErrorMessage(apiResponse?.data?.message)
      }
      ApiCall(false)
    } catch (error) {
      ApiCall(false)
      ErrorMessage(error?.message)
    }
  }


  const handleChangePage = (event, newPage) => {
    RestaurantListAPI(newPage + 1, rowsPerPage, filter.search)
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    RestaurantListAPI(pageNo, parseInt(event.target.value, 10), filter.search)
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);

  }

  const handleSearchFilter = (e) => {
    setPage(1);
    setFilter((val) => {
      return { ...val, ['search']: e.target.value };
    });

  }


  useEffect(() => {
    const timer = setTimeout(() => {
      RestaurantListAPI(1, rowsPerPage, filter.search)
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [filter.search])

  const handleDeleteApi = async () => {
    try {
      setLoader(true);
      const apiResponse = await callAPI(apiUrls.deleteReviewById, { "reviewId": deleteItemId }, "GET");
      if (apiResponse.data.status) {
        SuccessMessage(apiResponse.data.message);
        RestaurantListAPI(1, rowsPerPage, filter.search)
        setIsDeleteOpen(false);
        setDeleteItemId();
        setLoader(false);
        setPage(1);
      } else {
        ErrorMessage(apiResponse.data.message);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      ErrorMessage(error.message);
    }
  };

  const handleOpenDelete = (id) => {
    setDeleteItemId(id);
    setIsDeleteOpen(true);
  };


  return (
    <>
      <div className="tablecard mb-30">
        <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
          <h2 className="mb-0">History</h2>
          <figure className="mb-0">
            <img src="/mage/downimg.png" className="img-fluid" alt="" />
          </figure>
        </div>
        {restaurantListAPIList !== undefined && restaurantListAPIList?.map((val, i) => (
          <div className="contentdivbox gap-4 d-flex" key={i} style={{ borderBottom: "1px solid #137eda" }}>
            <div className="s_no">#{firstIndex + i + 1}</div>
            <div>
              <figure className="smdoc">
                <img src={defaultConfig.imagePath + val?.receipt} className="img-fluid" alt="" onClick={(() => window.open(defaultConfig.imagePath + val?.receipt))} />
              </figure>
              {/* <button className="revodr">Reviewing order</button> */}
            </div>
            <div className="contentdivbox_content flex-grow-1 d-flex flex-column gap-3 contentdivbox_contentnew">
              <div className="d-flex flexcustom gap-3 flex-wrap">
                <div className="itemdivboxone">
                  <h6>Restaurant Name</h6>
                  <p>{val?.restaurantName}</p>
                </div>
                <div className="itemdivboxone">
                  <h6>Restaurant Address</h6>
                  <p>{val?.restaurantAddress}</p>
                </div>
                <div className="itemdivboxone">
                  <h6>Time Received</h6>
                  <p>{moment(val?.createdAt).format('hh:mm A')}</p>
                </div>
                <div className="itemdivboxone">
                  <h6>Date Received</h6>
                  <p>{moment(val?.createdAt).format('MM/DD/YYYY')}</p>
                </div>
              </div>
              <div className="d-flex flexcustom gap-3 flex-wrap">
                <div className="itemdivboxone">
                  <h6>Receipt Number</h6>
                  <p>{val?.receiptNumber}</p>
                </div>
                <div className="itemdivboxone">
                  <h6>User Id</h6>
                  <p>{val?.userData[0]?.name?.toUpperCase()}</p>
                </div>
                <div className="itemdivboxone">
                  <h6>Ocr Time</h6>

                  <p> {val?.dateAndTime ? moment(val?.dateAndTime).utc().format('hh:mm A') : "---"}</p>
                </div>
                <div className="itemdivboxone">
                  <h6>Ocr Date</h6>
                  <p>{val?.dateAndTime ? moment(val?.dateAndTime).format('MM/DD/YYYY') : '---'}</p>
                </div>
                <div className="itemdivboxone">
                  <h6>Amount</h6>
                  <p>$ {val?.total_price ? val?.total_price : 0}</p>
                </div>
              </div>


              <div className="odr-menu my-2 newodr-menu">
                <h3 className="mb-0">Order Menu Items</h3>
              </div>
              <ul className="menupube">
                {val?.items !== undefined && val?.items.map((vals, is) => (
                  <React.Fragment key={is}>
                    <li ><i className={vals.status ? "fa fa-thumbs-o-up" : "fa fa-thumbs-o-down"} style={{
                      color: vals.status ? '#008080' : 'red', marginRight: "5px"
                    }} aria-hidden="true"></i>{vals?.item}</li>
                  </React.Fragment>
                ))
                }
              </ul>
              <div className="btndiv d-flex align-items-center gap-2">
                <Link to="#" className={val?.status === "approved" ? "btndarkblue newbtndarkblue " : "btnred newbtnread"} >
                  {val?.status}
                </Link>

                {val?.likeDislike === "like" ?
                  <div className="ratebox d-flex align-items-center gap-3 w-100" >
                    <figure className="mb-0" style={{ height: "40px", border: "none" }}>
                      <img src="/image/like-sm.png" className="img-fluid" alt="" />
                    </figure>
                  </div> :
                  <div className="ratebox d-flex align-items-center gap-3 w-100">
                    <figure className="mb-0" style={{ height: "40px" }}>
                      <img src="/image/dislike.png" className="img-fluid" alt="" />
                    </figure>
                    <div>
                      <h1>{val?.userData[0]?.name}</h1>
                      <p>
                        {val?.review}
                      </p>
                    </div>
                  </div>

                }

                {/* <Link to="#" className={"btnred"}  onClick={() => {
                              handleOpenDelete(val?._id);
                            }}> 
         Delete Review
         </Link> */}
              </div>
            </div>
          </div>
        ))
        }

        <div className="d-flex align-items-center justify-content-end bottom_nav">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <TablePagination
                rowsPerPageOptions={[2, 5, 10, 25]}
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
        {/* <div className="contentdivbox gap-4 d-flex">
              <div className="s_no">#9</div>
              <div className="flex-grow-1">
                <button className="revodr mt-0">Invited Friend</button>
                <div className="contentdivbox_content mt-3">
                  <div className="d-flex justify-content-between flexcustom gap-3 flex-wrap">
                    <div className="itemdivboxone">
                      <h6>Time Received</h6>
                      <p>11:30 AM</p>
                    </div>
                    <div className="itemdivboxone">
                      <h6>Date Received</h6>
                      <p>1/24/2024</p>
                    </div>
                    <div className="itemdivboxone">
                      <h6>User ID(Inviting)</h6>
                      <p>#123456</p>
                    </div>
                    <div className="itemdivboxone">
                      <h6>User ID(Invited)</h6>
                      <p>#123456</p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
      </div>

      <HandleDelete
        isOpen={isDeleteOpen}
        handleClose={() => {
          setIsDeleteOpen(false);
        }}
        handleDelete={handleDeleteApi}
        deleteTitle={"Are you sure delete this Review"}
        loder={loder}
      />
    </>
  )
}
