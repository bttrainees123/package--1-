import React, { useEffect, useRef, useState } from "react";
import {
  ErrorMessage,
  SubmitButton,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import SimpleReactValidator from "simple-react-validator";
import Dialog from "@mui/material/Dialog";
import { Link } from "react-router-dom";
import { DeleteSvg, EditSvg } from "../../../SvgFile/Index";
import { TablePagination } from "@mui/material";

export default function AddCatagory({
  open,
  handleclose,
  LogoListAPI,
  restaurantId,
  LogoList,
  Name,
}) {
  const [value, setValue] = useState({
    status: "active",
    name: "",
    restaurantId: "",
  });
  const [object, setObject] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const handleChange = (e) => {
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };
  const Serviceadd = async () => {
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        setLoader(true);
        const apiResponse = await callAPI(
          !object
            ? apiUrls.addFoodCategory
            : apiUrls.updateFoodCategory + `/${object}`,
          {},
          !object ? "POST" : "PUT",
          value
        );
        if (apiResponse?.data?.status === true) {
          SuccessMessage(apiResponse?.data?.message);
          await LogoListAPI();
          setValue({ status: "active", name: "", restaurantId: restaurantId });
          setObject("");
        } else {
          ErrorMessage(apiResponse?.data?.message);
        }
        setLoader(false);
      } catch (error) {
        setLoader(false);
        ErrorMessage(error?.message);
      }
    }
  };
  useEffect(() => {
    setValue({ status: "active", name: "", restaurantId: restaurantId });
  }, [open]);

  const handleEdit = (val) => {
    setObject(val?._id);
    setValue({
      status: val?.status,
      name: val?.name,
      restaurantId: restaurantId,
    });
  };
  const Cancel = () => {
    setObject("");
    setPage(1);
    setValue({ status: "active", name: "", restaurantId: restaurantId });
    handleclose();
  };
  const handleDelete = async (id) => {
    try {
      const response = await callAPI(
        apiUrls.deleteFoodCategory + `/${id}`,
        {},
        "GET"
      );
      if (response.data.status) {
        await LogoListAPI();
        SuccessMessage(response.data.message);
        setPage(1);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      ErrorMessage(error.message);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    let pageNo = 1;
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(pageNo);
  };

  return (
    <>
      <Dialog
        open={open}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "666px",
              borderRadius: "30px",
              // Set your width here
            },
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="modal-dialog modal-dialog-centered model828">
          <div className="modal-content modelcustomstyle">
            <div className="modal-header p-0 border-bottom-0 position-relative justify-content-center">
              <div className="modelheading text-center">
                <p>{Name ? Name : "---"}</p>
                <h1 className="modal-title" id="exampleModalLabel">
                  {!object ? "Add" : "Edit"} Category
                </h1>
                <p>Please enter your Category details</p>
              </div>
              <button
                type="button"
                className="btn-close position-absolute top-50 end-0"
                onClick={Cancel}
              />
            </div>
            <div className="modal-body px-0 py-4">
              <form className="formcontmodel mt-4">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleChange}
                      value={value.name}
                      name="name"
                    />
                    <div className="error">
                      {simpleValidator.current.message(
                        "Name",
                        value?.name,
                        `required|min:3`
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label htmlFor="">Status</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={handleChange}
                      value={value.status}
                      name="status"
                    >
                      <option
                        value="active"
                        selected={value.status === "active"}
                      >
                        Active
                      </option>
                      <option
                        value="inactive"
                        selected={value.status === "inactive"}
                      >
                        Inactive
                      </option>
                    </select>
                  </div>
                </div>
              </form>

              <div className="table-responsive">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LogoList !== undefined && LogoList?.length > 0 ? (
                      LogoList.slice(
                        (page - 1) * rowsPerPage,
                        page * rowsPerPage
                      )?.map((item, i) => (
                        <tr key={i}>
                          <td>{item?.name}</td>
                          <td className="text-start">
                            <div className="actionbtn d-flex align-items-center justify-content-end gap-2">
                              <Link
                                to="#"
                                className="editlink"
                                onClick={() => handleEdit(item)}
                              >
                                <EditSvg />
                              </Link>
                              <Link
                                to="#"
                                className="trashlink"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Are you sure to delete ${item?.name}?`
                                    )
                                  ) {
                                    handleDelete(item?._id);
                                  }
                                }}
                              >
                                <DeleteSvg />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">
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
                        rowsPerPageOptions={[5, 10, 15, 20]}
                        component="div"
                        count={LogoList?.length}
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

            <div className="modal-footer p-0 border-top-0 justify-content-center gap-3">
              <button
                type="button"
                className="btndarkblue-outline modalfooterpadding"
                onClick={Cancel}
              >
                Cancel
              </button>
              <SubmitButton
                text={!object ? "Save" : "Update"}
                disabled={loader}
                onClick={Serviceadd}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
