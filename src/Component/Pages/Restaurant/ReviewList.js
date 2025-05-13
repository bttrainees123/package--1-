import { Dialog } from '@mui/material';
import React from 'react'
import { defaultConfig } from '../../../config';
import moment from 'moment';
import { Link } from 'react-router-dom';

export default function ReviewList({ open, handleClose, ReviewList, status }) {
  return (
    <>
      <Dialog
        open={open}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "666px",
              borderRadius: "30px"
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
                <h1 className="modal-title" id="exampleModalLabel">
                  {ReviewList?.name}
                </h1>
                <p>Reviews ({ReviewList?.reviewdata?.length})</p>
              </div>
              <button
                type="button"
                className="btn-close position-absolute top-50 end-0"
                onClick={handleClose}
              />
            </div>
            <div className="modal-body px-0 py-4">

              {ReviewList?.reviewdata !== undefined && ReviewList?.reviewdata?.map((val, i) => (
                <div className="contentdivbox gap-4 d-flex boderbtn" key={i}>
                  <div className="s_no">#{i + 1}</div>
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
                      <div className="itemdivboxone">
                        <h6>Ocr Time</h6>
                        <p>{val?.dateAndTime ? moment(val?.dateAndTime).utc().format('hh:mm A') : "---"}</p>
                      </div>
                      <div className="itemdivboxone">
                        <h6>Ocr Date</h6>
                        <p>{val?.dateAndTime ? moment(val?.dateAndTime).format('MM/DD/YYYY') : '---'}</p>
                      </div>
                    </div>
                    <div className="d-flex flexcustom gap-3 flex-wrap">
                      <div className="itemdivboxone">
                        <h6>Receipt Number</h6>
                        <p>{val?.receiptNumber}</p>
                      </div>
                      {status && <div className="itemdivboxone">
                        <h6>User Id</h6>
                        <p>{val?.userData?.name?.toUpperCase()}</p>
                      </div>}
                      <div className="itemdivboxone">
                        <h6>Amount</h6>
                        <p>$ {val?.total_price ? val?.total_price : 0}</p>
                      </div>
                    </div>


                    {val?.likeDislike === "like" ?
                      <div className="ratebox d-flex align-items-center gap-3 mt-4" >
                        <figure className="mb-0" style={{ height: "40px", border: "none" }}>
                          <img src="/image/like-sm.png" className="img-fluid" alt="" />
                        </figure>
                      </div> :
                      <div className="ratebox d-flex align-items-center gap-3 mt-4">
                        <figure className="mb-0" style={{ height: "40px" }}>
                          <img src="/image/dislike.png" className="img-fluid" alt="" />
                        </figure>
                        <div>

                          <p>
                            {val?.review}
                          </p>
                        </div>
                      </div>

                    }
                    <div className="odr-menu my-2">
                      <h3 className="mb-0">Order Menu Items</h3>
                    </div>
                    <ul className="menupube">
                      {val?.items !== undefined && val?.items.map((vals, is) => (
                        <React.Fragment key={is}>
                          <li > <i className={vals.status ? "fa fa-thumbs-o-up" : "fa fa-thumbs-o-down"} style={{
                            color: vals.status ? '#008080' : 'red', marginRight: "5px"
                          }} aria-hidden="true"></i>{vals?.item}</li>
                        </React.Fragment>
                      ))
                      }
                    </ul>
                    <div className="btndiv d-flex align-items-center gap-2">
                      <Link to="#" className={val?.status === "approved" ? "btndarkblue" : "btnred"} >
                        {val?.status}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
              }
            </div>

          </div>
        </div>


      </Dialog>
    </>
  )
}
