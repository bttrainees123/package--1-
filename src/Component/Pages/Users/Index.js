import React, { useEffect, useState } from 'react'
import { TablePagination } from '@mui/material';
import { callAPI } from '../../../utils/apiUtils';
import { apiUrls } from '../../../utils/apiUrls';
import { ApiLoder, ErrorMessage, HandleDelete, SuccessMessage } from '../../../helpers/common';
import { DeleteSvg, EditSvg, SearchSvg } from '../../../SvgFile/Index';
import Topbar from '../../../Layout/Topbar'
import moment from 'moment';
import Addupdateuser from './Addupdateuser';
import ReviewList from '../Restaurant/ReviewList';
import { Link, NavLink } from 'react-router-dom';

export default function Index() {
  const [loder, setLoader] = useState(false)
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [filter, setFilter] = useState({ search: "" });
  const [restaurantListAPIList, setRestaurantListAPIList] = useState([]);
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false)
  const [action, setAction] = useState("")
  const [object, setObject] = useState("")
  const [reviewOpen, setReviewOpen] = useState(false);

  const lastIndex = page * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;

  const RestaurantListAPI = async (page, rowsPerPage, search) => {
    setLoader(true)
    try {
      let query = { search: search, page: page ? page : 1, limit: rowsPerPage ? rowsPerPage : 10 };

      const apiResponse = await callAPI(apiUrls.userLists, query, "GET");
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.length > 0) {
          setRestaurantListAPIList(apiResponse.data.data)
        } else setRestaurantListAPIList([])
        setPaginatedItems(apiResponse?.data?.count)
      } else {
        ErrorMessage(apiResponse?.data?.message)
      }
      setLoader(false)
    } catch (error) {
      setLoader(false)
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

  const handleSubmitApi = (e) => {
    RestaurantListAPI(page, rowsPerPage, filter.search)
  }


  const handleclose = () => {
    setOpen(false)

  }
  const handledelclose = () => {
    setDelOpen(false)

  }


  const handleDelete = async () => {
    setLoader(true)
    try {
      const response = await callAPI(apiUrls.updateDelete + `/${object._id}`, {}, 'GET')
      setLoader(false)
      if (response.data.status) {
        RestaurantListAPI(page, rowsPerPage, filter.search)
        SuccessMessage(response.data.message)
        setDelOpen(false)
      } else {
        ErrorMessage(response.data.message)
      }
    } catch (error) {
      setLoader(false)
      ErrorMessage(error.message)
    }
  }

  return (
    <>
      <div id="page-container" className="page_contclass">
        <Topbar Title="USERS" Subtitle="Users">

        </Topbar>
        <div className="inner-main-content">
          {loder && <ApiLoder />}
          <div className="tablecard mb-30">
            <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
              <h2 className="mb-0">USER</h2>
              <div className="d-flex align-items-center serchbx">
                <span className="">
                  <SearchSvg />
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search Users..."
                  onChange={handleSearchFilter}
                />
              </div>
            </div>
            <div className="table-responsive">

              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>USER</th>
                    {/* <th>invited by</th> */}
                    <th>Total Reviews</th>
                    {/* <th>Email</th> */}
                    <th>Phone No</th>
                    <th>Date/time</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(restaurantListAPIList !== undefined && restaurantListAPIList?.length > 0) ? restaurantListAPIList?.map((item, i) => (
                    <tr key={i}>
                      <td>{firstIndex + i + 1}</td>
                      <td><NavLink activeclassname="active" to={`/admin/users/history/${item?._id}`} className={"userHistoryLink"} >{item?.name?.toUpperCase()}</NavLink></td>
                      {/* <td>{item?.invitedBy?<Link to="#" class={i%2===0?"clobx blues":"clobx greens"}>
                         {item?.invitedBy?.toUpperCase()}
                        </Link>:"----"}</td> */}
                      <td> <Link to="#" className="textblue" onClick={(() => {
                        if (item?.reviewCount > 0) {
                          setObject(item)
                          setReviewOpen(true)
                        }

                      })
                      }>{item?.reviewCount}</Link></td>
                      {/* <td>
             {item?.email}
              </td> */}
                      <td>{item?.mobileno}</td>
                      <td>{moment(item?.createdAt).format('MM/DD/YYYY')}  | {moment(item?.createdAt).format('hh:mm A')}</td>
                      <td className="text-start">
                        <div className="actionbtn d-flex align-items-center justify-content-end gap-2">
                          {item?.status !== "active" && <Link to="#" className="btndarkblue padthree px-2">Ban</Link>}
                          {/* <Link to={`/admin/users/history/${item?._id}`}><img alt='' src='/image/view.png' className='img-fluid'/></Link> */}
                          <Link to="#" className="editlink" onClick={(() => {
                            setAction("edit")
                            setObject(item)
                            setOpen(true)
                          })
                          }>
                            <EditSvg />
                          </Link>
                          <Link to="#" className="trashlink" onClick={() => {
                            setDelOpen(true)
                            setObject(item)
                          }}>
                            <DeleteSvg />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )) : !loder && <tr>
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

        </div>
      </div>
      <ReviewList ReviewList={object} open={reviewOpen} handleClose={(() => setReviewOpen(false))} status={false} />
      <Addupdateuser open={open} handleclose={handleclose} action={action} handleSubmitApi={handleSubmitApi} object={object} />
      <HandleDelete isOpen={delOpen} handleClose={handledelclose} handleDelete={handleDelete} deleteTitle={'Are you sure delete this User'} loder={loder}
      />
    </>
  )
}
