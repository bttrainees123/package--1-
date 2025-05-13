import React from 'react'
import Dialog from '@mui/material/Dialog';
import moment from 'moment';
export default function More_info({ open, handleClose, data }) {
  return (
    <>
      <Dialog
        open={open}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",

              borderRadius: "30px"
              // Set your width here
            },
          },
        }}
      >
        <div className="modal-dialog modal-dialog-centered model828" style={{ maxWidth: "100%", width: "100%" }}>
          <div className="modal-content modelcustomstyle p-3">
            <div className="modal-header p-0 border-bottom-0 position-relative justify-content-center">
              <div className="modelheading text-center">
                <h1 className="modal-title" id="exampleModalLabel">
                  {data?.restaurantsData?.name}
                </h1>
              </div>
              <button
                type="button"
                className="btn-close position-absolute top-50 end-0"
                onClick={handleClose}
              />
            </div>
            <div className="modal-body px-0 py-0">
              <table className="table tableborderless mt-4">
                <tbody>
                  <tr>
                    <th>Restaurant Name</th>
                    <td className="text-end">{data?.restaurantsData?.name}</td>
                  </tr>
                  <tr>
                    <th >Geolocation</th>
                    <td className="text-end">{data?.latLong?.coordinates[0]} | {data?.latLong?.coordinates[1]}</td>
                  </tr>
                  <tr>

                    <th >User Id</th>
                    <td className="text-end">{data?.name ? data?.name?.toUpperCase() : '----'}</td>
                  </tr>
                  <tr>

                    <th >Email</th>
                    <td className="text-end">{data?.email}</td>
                  </tr>
                  {/* <tr>
    <th >Address</th>
      <td className="text-end">{data?.address}</td>
    </tr> */}
                  <tr>
                    <th >Business EIN</th>
                    <td className="text-end">{data?.businessEIN ? data?.businessEIN : "------"}</td>
                  </tr>
                  <tr>
                    <th >Invited At</th>
                    <td className="text-end">{moment(data?.createdAt).format('MM/DD/YYYY')}</td>
                  </tr>


                </tbody>
              </table>


            </div>

          </div>
        </div>


      </Dialog>
    </>
  )
}
