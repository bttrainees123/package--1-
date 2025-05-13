import { Link } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TablePagination } from '@mui/material';
import { callAPI } from '../../../utils/apiUtils';
import { apiUrls } from '../../../utils/apiUrls';
import { ApiLoder, ErrorMessage, HandleDelete, SuccessMessage } from '../../../helpers/common';
import { DeleteSvg, EditSvg, PlushSvg, SearchSvg } from '../../../SvgFile/Index';
import Topbar from '../../../Layout/Topbar'
import Addupdatedriver from './Addupdatedriver';
import QRcode from '../Restaurant/QRcode';

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
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [Qr, setQr] = useState("");

  const lastIndex = page * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;


  const RestaurantListAPI = async (page, rowsPerPage, search) => {
    setLoader(true)
    try {
      let query = { search: search, page: page ? page : 1, limit: rowsPerPage ? rowsPerPage : 10 };
      const apiResponse = await callAPI(apiUrls.driverList, query, "GET");
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

  const handleSubmitApi = (e) => {
    RestaurantListAPI(page, rowsPerPage, filter.search)
  }


  useEffect(() => {
    const timer = setTimeout(() => {
      RestaurantListAPI(1, rowsPerPage, filter.search)
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [filter.search])


  const handleclose = () => {
    setOpen(false)

  }
  const handledelclose = () => {
    setDelOpen(false)

  }

  const handleDelete = async () => {
    setLoader(true)
    try {
      const response = await callAPI(apiUrls.driverDelete + `/${object._id}`, {}, 'GET')
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
        <Topbar Title="Driver" Subtitle="Driver">
          <Link to="#" onClick={(() => {
            setAction("add")
            setOpen(true)
          })
          }
            className="creatbtn d-flex align-items-center justify-content-center gap-2"
          >
            <PlushSvg />
            Create Driver
          </Link>
        </Topbar>
        <div className="inner-main-content">
          {loder && <ApiLoder />}
          <div className="tablecard mb-30">
            <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
              <h2 className="mb-0">Driver</h2>
              <div className="d-flex align-items-center serchbx">
                <span className="">
                  <SearchSvg />
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search Drivers..."
                  onChange={handleSearchFilter}
                />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Driver Name</th>
                    <th>QR Code</th>
                    <th>Email</th>
                    <th>Phone No</th>
                    <th>No. Of user</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(restaurantListAPIList !== undefined && restaurantListAPIList?.length > 0) ? restaurantListAPIList?.map((item, i) => (
                    <tr key={i}>
                      <td>{firstIndex + i + 1}</td>
                      <td>{item?.name?.toUpperCase()}</td>
                      <td>
                        <div className="meetingsec d-flex align-items-center gap-2">
                          <Link to="#" onClick={(() => {
                            setIsQrOpen(true)
                            setQr(item.qrImage)
                          })}>
                            <img src="/image/scancode.png" className="img-fluid" alt="" />
                          </Link>
                        </div>
                      </td>
                      <td>
                        {item?.email}
                      </td>
                      <td>{item?.mobileno}</td>
                      <td><Link to="#" className="textblue">0</Link></td>
                      <td className="text-start">
                        <div className="actionbtn d-flex align-items-center justify-content-end gap-2">
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
      <QRcode open={isQrOpen} handleClose={() => { setIsQrOpen(false) }} qrImage={Qr} />
      <Addupdatedriver open={open} handleclose={handleclose} action={action} handleSubmitApi={handleSubmitApi} object={object} />
      <HandleDelete isOpen={delOpen} handleClose={handledelclose} handleDelete={handleDelete} deleteTitle={'Are you sure delete this Driver'} loder={loder}

      />
    </>
  )
}
