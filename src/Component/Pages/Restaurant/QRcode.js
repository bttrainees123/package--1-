import React from 'react';
import Dialog from '@mui/material/Dialog';

export default function QRcode({ open, qrImage, handleClose }) {
  return (
    <>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={'xs'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="modal-dialog modal-dialog-centered model472">
          <div className="modal-content modelcustomstyle">
            <div className="modal-header p-0 border-bottom-0 position-relative justify-content-center">
              <div className="modelheading text-center">
                <h1 className="modal-title" id="exampleModalLabel">
                  QR Code
                </h1>
              </div>
              <button
                type="button"
                className="btn-close position-absolute top-50 end-0"
                onClick={handleClose}
              />
            </div>
            <div className="modal-body px-0 py-4">
              <figure className="mb-0">
                <img
                  src={qrImage}
                  className="img-fluid d-block mx-auto"
                  alt=""
                />
              </figure>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
