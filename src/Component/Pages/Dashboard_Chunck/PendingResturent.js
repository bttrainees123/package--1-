import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { callAPI } from '../../../utils/apiUtils';
import { apiUrls } from '../../../utils/apiUrls';
import { ErrorMessage, SuccessMessage } from '../../../helpers/common';
import { SearchSvg } from '../../../SvgFile/Index';
import { TablePagination } from '@mui/material';
import More_info from './More_info';

export default function PendingResturent({ ApiCall }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [filter, setFilter] = useState({ search: "" });
  const [restaurantListAPIList, setRestaurantListAPIList] = useState([]);

  const lastIndex = page * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;

  const RestaurantListAPI = async (page, rowsPerPage, search) => {
    ApiCall(true)
    try {
      let query = { search: search, page: page ? page : 1, limit: rowsPerPage ? rowsPerPage : 10 };
      const apiResponse = await callAPI(apiUrls.pendingRestaurantList, query, "GET");
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


  const ApporvedRestaurant = async (id) => {
    ApiCall(true)
    try {
      let body = {
        restaurantId: id,
        type: "inNetwork"
      }
      const apiResponse = await callAPI(apiUrls.approveReject, {}, "POST", body);
      if (apiResponse?.data?.status === true) {
        SuccessMessage(apiResponse?.data?.message)
        RestaurantListAPI(page, rowsPerPage, filter.search)
      } else {
        ErrorMessage(apiResponse?.data?.message)
      }
      ApiCall(false)
    } catch (error) {
      ApiCall(false)
      ErrorMessage(error?.message)
    }
  }



  return (
    <>
      <More_info open={open} handleClose={(() => setOpen(false))} data={data} />
      <div className="tablecard mb-30">
        <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
          <h2 className="mb-0">Pending Request</h2>
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
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Restaurant Name</th>
                <th>Email</th>
                {/* <th>Address</th> */}
                {/* <th>Meeting</th> */}
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(restaurantListAPIList !== undefined && restaurantListAPIList?.length > 0) ? restaurantListAPIList?.map((item, i) => (
                <tr key={i}>
                  <td>{firstIndex + i + 1}</td>
                  <td>{item?.restaurantsData?.name}</td>
                  <td>{item?.email}</td>
                  {/* <td>{item?.address}</td> */}
                  {/* <td>
                      <div className="meetingsec d-flex align-items-center gap-2">
                        <Link to="#">
                          <img
                            src="/image/gvid.png"
                            className="img-fluid"
                            alt=""
                          />
                        </Link>
                        <Link to="#">
                          <img
                            src="/image/zoom.png"
                            className="img-fluid"
                            alt=""
                          />
                        </Link>
                      </div>
                    </td> */}
                  <td className="text-end">
                    <div className="actionbtn d-flex align-items-center justify-content-end gap-2">
                      <Link to="#" className="moreifo" onClick={(() => {
                        setData(item)
                        setOpen(true)
                      })}>
                        More Info
                      </Link>
                      <div className="dropdown">


                        <select className="selectpanding" onChange={(() => ApporvedRestaurant(item?.restaurantsData?._id))}>
                          <option value="pending" disabled="">Pending</option>
                          <option value="active">Approved</option>
                        </select>

                      </div>
                    </div>
                  </td>
                </tr>
              )) : <tr>
                <td colSpan="6">
                  <div className="no_record_text">
                    No Record Found
                  </div>
                </td>
              </tr>}
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

    </>
  )
}
