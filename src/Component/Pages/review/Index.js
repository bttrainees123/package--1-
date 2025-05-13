import React, { useEffect, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import { ApiLoder, ErrorMessage } from "../../../helpers/common";
import { apiUrls } from "../../../utils/apiUrls";
import { SearchSvg } from "../../../SvgFile/Index";
import Topbar from "../../../Layout/Topbar";
import { TablePagination } from "@mui/material";
import moment from "moment";
import { defaultConfig } from "../../../config";

export default function Index() {
  const [loader, setLoader] = useState(false);
  const [logoList, setLogoList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    search: "",
    Year: "",
    startDate: "",
    endDate: "",
    status: "",
  });
  const [submittedFilter, setSubmittedFilter] = useState({ ...filter });

  const lastIndex = page * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;

  const LogoListAPI = async (query) => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.restaurantRepeatedOrder,
        query,
        "GET"
      );
      if (apiResponse?.data?.status) {
        setLogoList(apiResponse?.data?.data?.ReviewData || []);
        setPaginatedItems(apiResponse?.data?.data?.total || 0);
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
    } catch (error) {
      ErrorMessage(error?.message);
    }
    setLoader(false);
  };

  const handleSearchFilter = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setSubmittedFilter(filter); // Store latest filter values
    setPage(1); // Reset to first page
  };

  const handleClear = () => {
    setFilter({ search: "", Year: "", startDate: "", endDate: "", status: "" });
    setSubmittedFilter({ search: "", Year: "", startDate: "", endDate: "", status: "" });
    setPage(1);
  };

  useEffect(() => {
    // Fetch data only when the user submits or changes pages
    LogoListAPI({ ...submittedFilter, page, limit: rowsPerPage });
  }, [submittedFilter, page, rowsPerPage]);

  const ReviewStatus = ({ status }) => {
    if (status === 'approved') {
      return "Approved"
    } else if (status === 'rejected') {
      return "Rejected"
    } else {
      return "Pending"
    }
  }
  return (
    <>
      <div id="page-container" className="page_contclass">
        <Topbar Title="Review Listing" Subtitle="Review Listing" />
        <div className="inner-main-content">
          {loader && <ApiLoder />}
          <div className="tablecard mb-30">
            <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
              <h2 className="mb-0">Review Listing</h2>
              <div className="d-flex gap-2">
                <div className="d-flex align-items-center serchbx">
                  <span>
                    <SearchSvg />
                  </span>
                  <input
                    type="search"
                    name="search"
                    className="form-control"
                    placeholder="Search review ..."
                    value={filter.search}
                    onChange={handleSearchFilter}
                  />
                </div>
                <select
                  name="status"
                  className="form-control"
                  value={filter.status}
                  onChange={handleSearchFilter}
                >
                  <option value="">Status</option>

                  <option value={"approved"}>
                    Approved
                  </option>
                  <option value={"pending"}>
                    Pending
                  </option>
                  <option value={"rejected"}>
                    Rejected
                  </option>


                </select>
                <select
                  name="Year"
                  className="form-control"
                  value={filter.Year}
                  onChange={handleSearchFilter}
                >
                  <option value="">Select Year</option>
                  {Array.from(
                    { length: new Date().getFullYear() - 1999 },
                    (_, i) => (
                      <option key={i} value={2000 + i}>
                        {2000 + i}
                      </option>
                    )
                  )}
                </select>
                <div className="d-flex gap-2">
                  <label className="startDate mt-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    className="form-control"
                    value={filter.startDate}
                    onChange={handleSearchFilter}
                  />
                </div>
                <div className="d-flex gap-2">
                  <label className="startDate mt-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    className="form-control"
                    value={filter.endDate}
                    onChange={handleSearchFilter}
                  />
                </div>
                <button
                  className="btndarkblue modalfooterpadding reviewSubmit"
                  onClick={handleClear}
                >
                  Clear
                </button>
                <button
                  className="btndarkblue modalfooterpadding reviewSubmit"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Restaurant Name</th>
                    <th>Review</th>
                    <th>User Id</th>
                    <th>Status</th>
                    <th>Upload Date and Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logoList.length > 0 ? (
                    logoList.map((item, i) => (
                      <tr key={i}>
                        <td>{firstIndex + i + 1}</td>
                        <td>
                          {item?.RestaurantData?.name
                            ? item.RestaurantData.name
                            : item?.restaurantName
                              ? item.restaurantName
                              : "-----"}

                        </td>
                        <td
                          className={item?.likeDislike === "like" ? "reviewLike" : "reviewdisLike"}
                          onClick={() =>
                            window.open(defaultConfig.imagePath + item?.receipt)
                          }
                        >
                          <img src={item?.likeDislike === "like" ? "/image/like-sm.png" : "/image/dislikesm.png"} className="img-fluid" alt=""></img>

                        </td>
                        <td>
                          {item?.userData?.name
                            ? item?.userData?.name.toUpperCase()
                            : "--------"}
                        </td>
                        <td className={item?.status === "approved" ? "reviewLike" : "reviewdisLike"}>
                          <ReviewStatus status={item?.status} />
                        </td>
                        <td>
                          {moment(item?.createdAt).format("MM/DD/YYYY")} |{" "}
                          {moment(item?.createdAt).format("hh:mm A")}
                        </td>
                      </tr>
                    ))
                  ) : !loader ? (
                    <tr>
                      <td colSpan="5">
                        <div className="no_record_text">No Record Found</div>
                      </td>
                    </tr>
                  ) : null}
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
                      onPageChange={(event, newPage) => setPage(newPage + 1)}
                      onRowsPerPageChange={(event) =>
                        setRowsPerPage(parseInt(event.target.value, 10))
                      }
                    />
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
