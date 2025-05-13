import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HeaderPart from './Dashboard_Chunck/HeaderPart'
import PendingResturent from './Dashboard_Chunck/PendingResturent'
import { ApiLoder, Breadcrumb, ErrorMessage } from '../../helpers/common'
import { callAPI } from '../../utils/apiUtils'
import { apiUrls } from '../../utils/apiUrls'
import AllReview from './Dashboard_Chunck/AllReview'
import Review_History from './Dashboard_Chunck/Review_History'

export default function Dashboard() {
  const [loder, setLoader] = useState(false)
  const [dasboardData, setdasboardData] = useState({})


  const DashboardListAPI = async (page) => {
    setLoader(true)
    try {
      let query = { page: page ? page : 1, limit: 1 };
      const apiResponse = await callAPI(apiUrls.dashboard, query, "GET");
      if (apiResponse?.data?.status === true) {
        setdasboardData(apiResponse?.data?.data)
      } else {
        ErrorMessage(apiResponse?.data?.message)
      }
      setLoader(false)
    } catch (error) {
      setLoader(false)
      ErrorMessage(error?.message)
    }
  }

  useEffect(() => {
    DashboardListAPI();
  }, [])


  const ApiCall = (status) => {
    setLoader(status)
  }

  return (
    <>
      {loder && <ApiLoder />}
      <div id="page-container" className="page_contclass">
        <Breadcrumb title={"Dashboard"} subtitle={"Home"} childrenTitle={"Dashboard"} link={"#"} />

        <div className="inner-main-content">
          <HeaderPart dasboardData={dasboardData} />
          <div className="boxtopmain mb-30">
            <div className="row">

              <div className="col-lg-3 col-md-6 col-12 mb-lg-0 mb-md-4 mb-3">
                <div className="boxone">
                  <div className="d-flex justify-content-between gap-3">

                    <figure>
                      <img src="/image/godaddy.png" className="img-fluid" alt="" />
                    </figure>




                  </div>
                  <Link to="https://www.godaddy.com/" className="textlink" target='_blank'>
                    View Link
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14}
                      height={14}
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M9.74576 10.9124C9.63574 11.0187 9.48839 11.0775 9.33544 11.0761C9.18249 11.0748 9.03619 11.0135 8.92803 10.9053C8.81988 10.7972 8.75853 10.6508 8.7572 10.4979C8.75587 10.3449 8.81467 10.1976 8.92093 10.0876L11.4252 7.58333H1.16668C1.01197 7.58333 0.863594 7.52187 0.754198 7.41247C0.644802 7.30308 0.583344 7.1547 0.583344 6.99999C0.583344 6.84528 0.644802 6.69691 0.754198 6.58751C0.863594 6.47812 1.01197 6.41666 1.16668 6.41666H11.4252L8.92093 3.91241C8.81467 3.80239 8.75587 3.65504 8.7572 3.50209C8.75853 3.34914 8.81988 3.20284 8.92803 3.09468C9.03619 2.98653 9.18249 2.92518 9.33544 2.92385C9.48839 2.92252 9.63574 2.98132 9.74576 3.08758L13.2458 6.58758C13.3551 6.69697 13.4166 6.84531 13.4166 6.99999C13.4166 7.15467 13.3551 7.30302 13.2458 7.41241L9.74576 10.9124Z"
                        fill="#F10202"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-12 mb-lg-0 mb-md-4 mb-3">
                <div className="boxone">
                  <div className="d-flex justify-content-between gap-3">
                    <figure>
                      <img src="/image/twilio.png" className="img-fluid" alt="" />
                    </figure>



                  </div>
                  <Link to="https://www.twilio.com/" className="textlink" target='_blank'>
                    View Link
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14}
                      height={14}
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M9.74576 10.9124C9.63574 11.0187 9.48839 11.0775 9.33544 11.0761C9.18249 11.0748 9.03619 11.0135 8.92803 10.9053C8.81988 10.7972 8.75853 10.6508 8.7572 10.4979C8.75587 10.3449 8.81467 10.1976 8.92093 10.0876L11.4252 7.58333H1.16668C1.01197 7.58333 0.863594 7.52187 0.754198 7.41247C0.644802 7.30308 0.583344 7.1547 0.583344 6.99999C0.583344 6.84528 0.644802 6.69691 0.754198 6.58751C0.863594 6.47812 1.01197 6.41666 1.16668 6.41666H11.4252L8.92093 3.91241C8.81467 3.80239 8.75587 3.65504 8.7572 3.50209C8.75853 3.34914 8.81988 3.20284 8.92803 3.09468C9.03619 2.98653 9.18249 2.92518 9.33544 2.92385C9.48839 2.92252 9.63574 2.98132 9.74576 3.08758L13.2458 6.58758C13.3551 6.69697 13.4166 6.84531 13.4166 6.99999C13.4166 7.15467 13.3551 7.30302 13.2458 7.41241L9.74576 10.9124Z"
                        fill="#F10202"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-12 mb-lg-0 mb-md-4 mb-3">
                <div className="boxone">
                  <div className="d-flex justify-content-between gap-3">
                    <figure>
                      <img src="/image/map.png" className="img-fluid" alt="" />
                    </figure>



                  </div>
                  <Link to="https://cloud.google.com/" className="textlink" target='_blank'>
                    View Link
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14}
                      height={14}
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M9.74576 10.9124C9.63574 11.0187 9.48839 11.0775 9.33544 11.0761C9.18249 11.0748 9.03619 11.0135 8.92803 10.9053C8.81988 10.7972 8.75853 10.6508 8.7572 10.4979C8.75587 10.3449 8.81467 10.1976 8.92093 10.0876L11.4252 7.58333H1.16668C1.01197 7.58333 0.863594 7.52187 0.754198 7.41247C0.644802 7.30308 0.583344 7.1547 0.583344 6.99999C0.583344 6.84528 0.644802 6.69691 0.754198 6.58751C0.863594 6.47812 1.01197 6.41666 1.16668 6.41666H11.4252L8.92093 3.91241C8.81467 3.80239 8.75587 3.65504 8.7572 3.50209C8.75853 3.34914 8.81988 3.20284 8.92803 3.09468C9.03619 2.98653 9.18249 2.92518 9.33544 2.92385C9.48839 2.92252 9.63574 2.98132 9.74576 3.08758L13.2458 6.58758C13.3551 6.69697 13.4166 6.84531 13.4166 6.99999C13.4166 7.15467 13.3551 7.30302 13.2458 7.41241L9.74576 10.9124Z"
                        fill="#F10202"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-12 mb-lg-0 mb-md-4 mb-3">
                <div className="boxone">
                  <div className="d-flex justify-content-between gap-3">
                    <figure>
                      <img src="/image/zoho.png" className="img-fluid" alt="" />
                    </figure>



                  </div>
                  <Link to="https://www.zoho.com/" className="textlink" target='_blank'>
                    View Link
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14}
                      height={14}
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M9.74576 10.9124C9.63574 11.0187 9.48839 11.0775 9.33544 11.0761C9.18249 11.0748 9.03619 11.0135 8.92803 10.9053C8.81988 10.7972 8.75853 10.6508 8.7572 10.4979C8.75587 10.3449 8.81467 10.1976 8.92093 10.0876L11.4252 7.58333H1.16668C1.01197 7.58333 0.863594 7.52187 0.754198 7.41247C0.644802 7.30308 0.583344 7.1547 0.583344 6.99999C0.583344 6.84528 0.644802 6.69691 0.754198 6.58751C0.863594 6.47812 1.01197 6.41666 1.16668 6.41666H11.4252L8.92093 3.91241C8.81467 3.80239 8.75587 3.65504 8.7572 3.50209C8.75853 3.34914 8.81988 3.20284 8.92803 3.09468C9.03619 2.98653 9.18249 2.92518 9.33544 2.92385C9.48839 2.92252 9.63574 2.98132 9.74576 3.08758L13.2458 6.58758C13.3551 6.69697 13.4166 6.84531 13.4166 6.99999C13.4166 7.15467 13.3551 7.30302 13.2458 7.41241L9.74576 10.9124Z"
                        fill="#F10202"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

            </div>
          </div>

          <PendingResturent ApiCall={ApiCall} />
          <AllReview dasboardData={dasboardData} DashboardListAPI={DashboardListAPI} />
          {/* <div className="tablecard mb-30">
            <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
              <h2 className="mb-0">Driver redeemed points</h2>
              <div className="d-flex align-items-center serchbx">
                <span className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M10.5303 10.5407L14 14M12 7C12 9.7614 9.7614 12 7 12C4.23857 12 2 9.7614 2 7C2 4.23857 4.23857 2 7 2C9.7614 2 12 4.23857 12 7Z"
                      stroke="#8A8A8A"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search Restaurant..."
                />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date/Time</th>
                    <th>Driver Name</th>
                    <th>redeeming points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1/19/2024 | 11:05AM</td>
                    <td>Ganges Grill</td>
                    <td>
                      <Link to="#" className="textblue">
                        #256
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>1/19/2024 | 11:05AM</td>
                    <td>Ganges Grill</td>
                    <td>
                      <Link to="#" className="textblue">
                        #256
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>1/19/2024 | 11:05AM</td>
                    <td>Ganges Grill</td>
                    <td>
                      <Link to="#" className="textblue">
                        #256
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>1/19/2024 | 11:05AM</td>
                    <td>Ganges Grill</td>
                    <td>
                      <Link to="#" className="textblue">
                        #256
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> */}
          <Review_History ApiCall={ApiCall} />


        </div>
      </div>


    </>
  )
}
