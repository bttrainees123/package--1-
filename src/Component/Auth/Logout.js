import React from 'react';
import Dialog from '@mui/material/Dialog';
import { removeAuth } from '../../helpers/auth';
import { useNavigate } from 'react-router-dom';
import { SuccessMessage } from '../../helpers/common';

export default function Logout({ open, handleClose }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    removeAuth();
    handleClose();
    SuccessMessage("Logged out Successfully")
    navigate('/')

  }
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
            <div className="modal-header p-0 border-bottom-0 position-relative justify-content-center"></div>
            <div className="modal-body px-0 py-0">
              <figure className="logout mb-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  id="sign-out-alt"
                >
                  <path
                    fill="#6563FF"
                    d="M12.59,13l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-4-4a1,1,0,1,0-1.42,1.42L12.59,11H3a1,1,0,0,0,0,2ZM12,2A10,10,0,0,0,3,7.55a1,1,0,0,0,1.8.9A8,8,0,1,1,12,20a7.93,7.93,0,0,1-7.16-4.45,1,1,0,0,0-1.8.9A10,10,0,1,0,12,2Z"
                  ></path>
                </svg>
              </figure>
              <div className="modelheading text-center mt-3 mb-4">
                <h1 className="modal-title" id="exampleModalLabel">
                  Logout
                </h1>
                <p>Are you sure you want to logout</p>
              </div>
            </div>
            <div className="modal-footer p-0 border-top-0 justify-content-center gap-3">
              <button type="button" className="btndarkblue modalfooterpadding" onClick={handleLogout}>
                Yes
              </button>
              <button
                type="button"
                className="btndarkblue-outline modalfooterpadding"
                onClick={handleClose}
              >
                No
              </button>
            </div>
          </div>
        </div>


      </Dialog>
    </>
  )
}
