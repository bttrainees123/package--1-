import React, { useEffect, useState } from 'react'
import { TablePagination } from '@mui/material';
import { callAPI } from '../../../utils/apiUtils';
import { apiUrls } from '../../../utils/apiUrls';
import { ApiLoder, CapitalizeFirstLatter, ErrorMessage } from '../../../helpers/common';
import { SearchSvg } from '../../../SvgFile/Index';
import Topbar from '../../../Layout/Topbar'
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';

export default function UserHistory() {
  const [loder, setLoader] = useState(false)
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [userData, setuserData] = useState({});
  const [filter, setFilter] = useState({ search: "" });
  const [restaurantListAPIList, setRestaurantListAPIList] = useState([]);
  const param = useParams();

  const lastIndex = page * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;

  const RestaurantListAPI = async (page, rowsPerPage, search) => {
    setLoader(true)
    try {
      let query = { userId: param.id, search: search, page: page ? page : 1, limit: rowsPerPage ? rowsPerPage : 10 };
      const apiResponse = await callAPI(apiUrls.userHistoryAdmin, query, "GET");
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.paginatedResults?.length > 0) {
          setRestaurantListAPIList(apiResponse.data.data.paginatedResults)
        } else setRestaurantListAPIList([])

        setuserData(apiResponse?.data?.userData)
        setPaginatedItems(apiResponse?.data?.data?.totalCount)
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



  function IdentifyEventType(type, data, item) {
    switch (type) {
      case 'Friend Invite':
        return data?.name?.toUpperCase()
      case 'Platform order':
        return `${data?.name} (${item?.platformOrderHistory[0]?.Platformlogodata?.title})`
      case 'Review':
        return data?.restaurantName
      case 'Platform order Feedback':
        return `${data?.name} (${CapitalizeFirstLatter(item?.feedBackData[0]?.logodataforfeedback?.title)})`
      case 'Feedback':
        return "N-again App"
      default:
        return "----"
    }
  }

  function ShowAddress(type, data) {
    switch (type) {
      case 'Platform order':
        return data?.address
      case 'Review':
        return data?.restaurantAddress
      case 'Platform order Feedback':
        return data?.address
      default:
        return "----"
    }
  }

  function IdentifyFeedback(type, data, item) {
    switch (type) {
      case 'Feedback':
        return data?.message
      case 'Platform order Feedback':
        return item?.message
      default:
        return "----"
    }
  }





  return (
    <>
      {loder && <ApiLoder />}
      <div id="page-container" className="page_contclass">
        <Topbar Title="USERS" Subtitle="Users History">

        </Topbar>
        <div className="inner-main-content">
          <div className="tablecard mb-30">
            <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
              <h2 className="mb-0">USER HISTORY</h2>
              <div className="d-flex align-items-center serchbx">
                <span className="">
                  <SearchSvg />
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search Here..."
                  onChange={handleSearchFilter}
                />
              </div>
            </div>
            <div className="nofousersec d-flex align-items-center justify-content-between">
              <div className="nofouserdata d-flex align-items-center gap-3">
                <Link to={`/admin/users`}> <figure className="mb-0" >X</figure></Link>
                <div>
                  <h2 className="mb-1">{userData?.name?.toUpperCase()}</h2>
                  <p>{userData?.mobileno}</p>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Event Type</th>
                    <th>Name</th>
                    <th>Feedback</th>
                    <th>Date/Time</th>
                    <th>Address</th>
                    <th colSpan={1} />
                  </tr>
                </thead>
                <tbody>
                  <tr >
                    <td>1</td>
                    <td>Invited By</td>
                    <td><Link className='clobx greens'>{userData.invitedBy ? userData?.invitedBy : "This user was not invited by anyone."}</Link></td>
                    <td>--------</td>
                    <td>--------</td>
                    <td>--------</td>

                  </tr>
                  {(restaurantListAPIList !== undefined && restaurantListAPIList?.length > 0) ? restaurantListAPIList?.map((item, i) => (
                    <tr key={i}>
                      <td>{firstIndex + i + 1}</td>
                      <td>{item.eventType}</td>
                      <td><Link to="#" className={item.eventType === "Feedback" ? "clobx blues" : item.eventType === "Friend Invite" ? "clobx reds" : "clobx greens"}>{IdentifyEventType(item.eventType, item.data[0], item)}
                      </Link></td>
                      <td>{IdentifyFeedback(item.eventType, item.data[0], item)}</td>
                      <td>{moment(item?.createdAt).format('MM/DD/YYYY')}  | {moment(item?.createdAt).format('hh:mm A')}</td>
                      <td>{ShowAddress(item.eventType, item.data[0])}</td>
                      {/* <td>
                <Link to="#" className="btndarkblue padthree px-2">
                  More
                </Link>
              </td> */}
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

    </>
  )
}
