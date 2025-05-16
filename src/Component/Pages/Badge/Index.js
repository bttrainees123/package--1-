import React, { useEffect, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import { ApiLoder, ErrorMessage } from "../../../helpers/common";
import { apiUrls } from "../../../utils/apiUrls";
import Topbar from "../../../Layout/Topbar";
import { TablePagination } from "@mui/material";
// import moment from "moment";

export default function Index() {
  const [loader, setLoader] = useState(false);
  const [logoList, setLogoList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedItems, setPaginatedItems] = useState(0);
  const [page, setPage] = useState(1);
  const [cities, setCities] = useState([])
  const [filter, setFilter] = useState({
    // startDate: moment().subtract(1, "months").format("YYYY-MM-DD"),
    // endDate: moment().format("YYYY-MM-DD"),
    city: "Everett"
  });
  const [submittedFilter, setSubmittedFilter] = useState({ ...filter });
  const lastIndex = page * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;
  const LogoListAPI = async (query) => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(apiUrls.getBadges, query, "GET");
      if (apiResponse?.data?.status) {
        setLogoList(apiResponse?.data?.data?.badgeArray || []);
        setCities(apiResponse?.data?.data?.cities || []);
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
  // const handleClear = () => {
  //   setFilter({
  // startDate: moment().subtract(1, "months").format("YYYY-MM-DD"),
  // endDate: moment().format("YYYY-MM-DD"),
  //   city: "Everett"
  // });
  // setSubmittedFilter({
  // startDate: moment().subtract(1, "months").format("YYYY-MM-DD"),
  // endDate: moment().format("YYYY-MM-DD"),
  //     city: "Everett"
  //   });
  //   setPage(1);
  // };

  useEffect(() => {
    LogoListAPI({ ...submittedFilter, page, limit: rowsPerPage });
  }, [submittedFilter, page, rowsPerPage]);

  return (
    <>
      <div id="page-container" className="page_contclass">
        <Topbar Title="	Badges Listing" Subtitle="	Badges Listing" />
        <div className="inner-main-content">
          {loader && <ApiLoder />}
          <div className="tablecard mb-30">
            <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
              <h2 className="mb-0">	Badges Listing</h2>
              <div className="d-flex gap-2">
                <label className="startDate mt-2">City</label>
                <select
                  name="city"
                  className="form-control"
                  value={filter.city}
                  onChange={handleSearchFilter}
                >
                  {/* <option value="">All Cities</option> */}
                  {cities.map((city, i) => (
                    <option key={i} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {/* <div className="d-flex gap-2">
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
                </div> */}
                {/* <button
                  className="btndarkblue modalfooterpadding reviewSubmit"
                  onClick={handleClear}
                >
                  Clear
                </button> */}
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
                    <th>Badges</th>
                    <th>Menu Item</th>
                  </tr>
                </thead>
                <tbody>
                  {logoList.length > 0 ? (
                    logoList.map(
                      (item, i) =>
                      // item.menu.tags.length > 0 && 
                      (
                        <tr key={i}>
                          <td>{firstIndex + i + 1}</td>
                          <td>
                            <div className="badge-container">
                              {/* {item.menu.tags.map((item1, index) => ( */}
                              <div className="menu-badge"
                              //  key={index}
                              >
                                {`#1 ${item.tags} in ${submittedFilter.city}`}
                              </div>
                              {/* // ))} */}
                            </div>
                          </td>
                          <td>
                            <div className="badge-container">
                              {item.menuItems.map((item1, index) => (
                                <div className="menu-badge" key={index}
                                >
                                  {`${item1.itemname}`}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )
                    )
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
                      onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10))
                        setPage(page)
                      }
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
