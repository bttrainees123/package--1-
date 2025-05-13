import React from 'react'
import { Link } from 'react-router-dom';
import Logout from '../Component/Auth/Logout';

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const user = JSON.parse(localStorage.getItem('userData'));
  return (
    <>
      <div id="header">
        <div className="header-left">
          <div className="mobile_hamicon" id="ham">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={12}
              viewBox="0 0 18 12"
              fill="none"
            >
              <path
                d="M1 12C0.716667 12 0.479333 11.904 0.288 11.712C0.0960001 11.5207 0 11.2833 0 11C0 10.7167 0.0960001 10.4793 0.288 10.288C0.479333 10.096 0.716667 10 1 10H17C17.2833 10 17.5207 10.096 17.712 10.288C17.904 10.4793 18 10.7167 18 11C18 11.2833 17.904 11.5207 17.712 11.712C17.5207 11.904 17.2833 12 17 12H1ZM1 7C0.716667 7 0.479333 6.904 0.288 6.712C0.0960001 6.52067 0 6.28333 0 6C0 5.71667 0.0960001 5.479 0.288 5.287C0.479333 5.09567 0.716667 5 1 5H17C17.2833 5 17.5207 5.09567 17.712 5.287C17.904 5.479 18 5.71667 18 6C18 6.28333 17.904 6.52067 17.712 6.712C17.5207 6.904 17.2833 7 17 7H1ZM1 2C0.716667 2 0.479333 1.90433 0.288 1.713C0.0960001 1.521 0 1.28333 0 1C0 0.716667 0.0960001 0.479 0.288 0.287C0.479333 0.0956668 0.716667 0 1 0H17C17.2833 0 17.5207 0.0956668 17.712 0.287C17.904 0.479 18 0.716667 18 1C18 1.28333 17.904 1.521 17.712 1.713C17.5207 1.90433 17.2833 2 17 2H1Z"
                fill="black"
              />
            </svg>
          </div>
          {/* <h2 class="heading_24 mb-0">Dashboard</h2> */}
          <div className="right_headsec d-flex align-items-center gap-4">
            <div className="dropdown dropdownbell">
              <Link
                className=""
                type="button"
              // data-bs-toggle="dropdown"
              // aria-expanded="false"
              >
                <img src="/image/bell.png" className="img-fluid" alt="" />
                <span className="countno">0</span>
              </Link>
              {/* <div className="dropdown-menu dropdown-menu-custone dropdown-menu-end dropdown_notificaton">
                <div className="d-flex align-items-center justify-content-between pad-20">
                  <div className="d-flex align-items-center gap-3">
                    <h4 className="mb-0 text-dark">Notifications</h4>
                    <select
                      className="form-select select-notif"
                      aria-label="Default select example"
                    >
                      <option selected="">All</option>
                      <option value={1}>all</option>
                      <option value={2}>Two</option>
                      <option value={3}>Three</option>
                    </select>
                  </div>
                  <Link to="#" className="text_14 text-decoration-underline">
                    view all
                  </Link>
                </div>
                <div>
                  <div className="d-flex pad-20 pb-0">
                    <figure className="mb-0 size_32">
                      <img src="/image/user-2.jpg" className="mb-0" alt="" />
                    </figure>
                    <div>
                      <p className="notif_title mb-3">
                        <strong>James Saris</strong> purchased project{" "}
                        <strong>Wall Ceiling</strong>
                      </p>
                      <p className="notif_time">Yesterday at 11:42 PM</p>
                    </div>
                  </div>
                  <hr className="hr_new my-2" />
                </div>
                <div>
                  <div className="d-flex pad-20 pb-0">
                    <figure className="mb-0 size_32">
                      <img src="/image/user-3.jpg" className="mb-0" alt="" />
                    </figure>
                    <div>
                      <p className="notif_title mb-3">
                        <strong>James Saris</strong> purchased project{" "}
                        <strong>Wall Ceiling</strong>
                      </p>
                      <p className="notif_time">Yesterday at 11:42 PM</p>
                    </div>
                  </div>
                  <hr className="hr_new my-2" />
                </div>
                <div>
                  <div className="d-flex pad-20 pb-0">
                    <figure className="mb-0 size_32">
                      <img src="/image/user-2.jpg" className="mb-0" alt="" />
                    </figure>
                    <div>
                      <p className="notif_title mb-3">
                        <strong>James Saris</strong> purchased project{" "}
                        <strong>Wall Ceiling</strong>
                      </p>
                      <p className="notif_time">Yesterday at 11:42 PM</p>
                    </div>
                  </div>
                  <hr className="hr_new my-2" />
                </div>
                <div>
                  <div className="d-flex pad-20 pb-0">
                    <figure className="mb-0 size_32">
                      <img src="/image/user-3.jpg" className="mb-0" alt="" />
                    </figure>
                    <div>
                      <p className="notif_title mb-3">
                        <strong>James Saris</strong> purchased project{" "}
                        <strong>Wall Ceiling</strong>
                      </p>
                      <p className="notif_time">Yesterday at 11:42 PM</p>
                    </div>
                  </div>
                </div>
                <div className="text-center my-3">
                  <Link to="#" className="notif_time">
                    View
                  </Link>
                </div>
              </div> */}
            </div>
            <div className="dropdown dropdown_custone">
              <Link
                className="account d-flex align-items-center dropdown-toggle dropdown-toggle-custone droptoggle-none"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <figure className="user_pic">
                  <img src="/image/user.png" className="img-fluid" alt="" />
                </figure>
                <div className="d-flex flex-column">
                  <span className="textadmnbig">{user?.name}</span>
                  <span className="textadmn">Admin</span>
                </div>
              </Link>
              <ul className="dropdown-menu dropdown-menu-custone dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 4C7.58394 4 4 7.58394 4 12C4 16.4161 7.58394 20 12 20C16.4161 20 20 16.4161 20 12C20.0001 7.58394 16.4161 4 12 4ZM12.992 16.4961C12.992 17.0561 12.544 17.4882 12 17.4882C11.456 17.4882 11.008 17.0401 11.008 16.4961L11.0081 10.4962C11.0081 9.93626 11.4562 9.50419 12.0001 9.50419C12.5441 9.50419 12.9922 9.95224 12.9922 10.4962L12.992 16.4961ZM12 8.49614C11.44 8.49614 11.008 8.04808 11.008 7.5041C11.008 6.96009 11.456 6.51207 12 6.51207C12.544 6.51207 12.992 6.96012 12.992 7.5041C12.992 8.04811 12.5601 8.49614 12 8.49614Z"
                        fill="#434656"
                      />
                    </svg>
                    Profile Info
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.7094 4.36857C13.6221 4.23235 13.4828 4.13882 13.3245 4.11195C12.4478 3.96268 11.5522 3.96268 10.6756 4.11195C10.5172 4.13883 10.3778 4.23235 10.2906 4.36857L9.49443 5.61462C9.16498 5.74531 8.84505 5.90226 8.53796 6.08317C8.53856 6.08317 7.0849 5.93943 7.0849 5.93943C6.92532 5.92361 6.76633 5.97659 6.64722 6.08517C5.98578 6.6893 5.42757 7.4014 4.99534 8.192C4.91758 8.33451 4.90203 8.50375 4.95276 8.65779L5.41418 10.0677C5.30925 10.4117 5.23013 10.764 5.17804 11.1204L4.16132 12.1862C4.04974 12.3038 3.99162 12.4628 4.00098 12.6259C4.05246 13.5286 4.25191 14.416 4.59026 15.2521C4.6511 15.4027 4.77143 15.5211 4.92166 15.5769L6.29289 16.0888C6.49173 16.3867 6.71292 16.6694 6.9551 16.9337C6.9551 16.9329 7.14051 18.4067 7.14051 18.4067C7.16074 18.5685 7.24665 18.7137 7.37785 18.8079C8.10438 19.3294 8.91076 19.7244 9.76442 19.9768C9.91857 20.0223 10.0843 20.0003 10.221 19.9157L11.469 19.1443C11.8221 19.1718 12.1772 19.1718 12.531 19.1443L13.7792 19.9157C13.9158 20.0003 14.0814 20.0223 14.2357 19.9768C15.0894 19.7244 15.8957 19.3294 16.6221 18.8079C16.7535 18.7137 16.8394 18.5685 16.8596 18.4067L17.045 16.9329C17.2864 16.6694 17.5084 16.3875 17.7072 16.0888L19.0785 15.5769C19.2285 15.5211 19.349 15.4027 19.4099 15.2521C19.7481 14.416 19.9477 13.5286 19.999 12.6259C20.0085 12.4628 19.9504 12.3038 19.8387 12.1862L18.8221 11.1204C18.77 10.764 18.6907 10.4117 18.5859 10.0669C18.5859 10.0677 19.0472 8.65775 19.0472 8.65775C19.0981 8.50372 19.0824 8.33449 19.0046 8.19196C18.5724 7.4014 18.0143 6.68926 17.3528 6.08513C17.2338 5.97655 17.0748 5.92357 16.9151 5.93939L15.4614 6.08313C15.1557 5.90222 14.8357 5.74527 14.505 5.6138C14.5056 5.61457 13.7094 4.36849 13.7094 4.36849L13.7094 4.36857ZM12 9.00329C10.2926 9.00329 8.90588 10.4131 8.90588 12.1504C8.90588 13.887 10.2926 15.2968 12 15.2968C13.7074 15.2968 15.094 13.887 15.094 12.1504C15.094 10.4131 13.7074 9.00329 12 9.00329ZM12 10.1667C13.0763 10.1667 13.9496 11.0556 13.9496 12.1504C13.9496 13.2451 13.0763 14.1333 12 14.1333C10.9237 14.1333 10.0505 13.2451 10.0505 12.1504C10.0505 11.0556 10.9237 10.1667 12 10.1667Z"
                        fill="#434656"
                      />
                    </svg>
                    Settings
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12.0011 11.9994V8.96227H8.85605C8.68609 9.85831 8.58095 10.8716 8.55803 11.9994H12.0011ZM12.0011 7.96103V4C10.8333 4.29229 9.71714 5.63132 9.08529 7.96103H12.0011ZM7.56107 13.0006H4C4.06064 14.0498 4.31126 15.0643 4.73568 16.0043H7.84307C7.67959 15.0795 7.58452 14.0736 7.56107 13.0006ZM4 11.9994H7.56004C7.58113 10.9137 7.67559 9.89626 7.84071 8.96227H4.75098C4.31738 9.91171 4.06133 10.9378 4 11.9994ZM12.9989 4.00417V7.96103H15.906C15.6669 7.08869 15.3806 6.43234 15.1163 5.95308C14.5255 4.88166 13.7875 4.20769 12.9989 4.00417ZM12.0011 13.0006H8.55913C8.5853 14.1684 8.69666 15.1627 8.85605 16.0043H12.0011L12.0011 13.0006ZM15.9894 5.46835C16.3834 6.1828 16.7003 7.02017 16.9367 7.96103H19.7082C19.371 7.42627 18.9719 6.92469 18.5142 6.46545C17.5868 5.53487 16.4861 4.84531 15.2876 4.42683C15.5401 4.73154 15.7748 5.0791 15.9894 5.46835ZM16.4409 11.9994C16.4144 10.816 16.3003 9.81099 16.1375 8.96227H12.9989V11.9994H16.4409ZM16.9554 17.0056C16.7185 17.9666 16.3977 18.8205 15.9966 19.5467C15.7868 19.9263 15.5578 20.266 15.3116 20.5648C16.5009 20.1455 17.5929 19.4589 18.5141 18.5345C18.9813 18.0658 19.3872 17.5528 19.7288 17.0056H16.9554ZM8.05302 7.96103C8.28911 7.01366 8.60699 6.17112 9.00344 5.45343C9.21322 5.0737 9.44223 4.73397 9.68853 4.4351C8.49922 4.85439 7.40707 5.54104 6.48582 6.46542C6.02814 6.92465 5.629 7.42624 5.29175 7.961L8.05302 7.96103ZM17.1508 8.96227C17.318 9.8963 17.4152 10.9134 17.439 11.9994H21C20.9387 10.9378 20.6826 9.91171 20.249 8.96227H17.1508ZM9.01062 19.5318C8.61198 18.8089 8.29237 17.96 8.05508 17.0056H5.27123C5.61283 17.5528 6.01872 18.0658 6.48585 18.5345C7.41326 19.4651 8.51386 20.1546 9.71245 20.5731C9.45986 20.2685 9.22523 19.9209 9.01062 19.5318ZM12.9989 13.0006V16.0043H16.1503C16.3166 15.1165 16.4195 14.1144 16.442 13.0006H12.9989ZM21 13.0006H17.4401C17.4192 14.0734 17.3267 15.0795 17.1652 16.0043H20.2643C20.6887 15.0642 20.9394 14.0498 21 13.0006ZM12.9989 17.0056V21C14.1724 20.7063 15.2938 19.3561 15.924 17.0056H12.9989ZM12.0011 20.9958V17.0056H9.0849C9.32584 17.8947 9.61612 18.5617 9.88374 19.047C10.4745 20.1184 11.2125 20.7923 12.0011 20.9958Z"
                        fill="#434656"
                      />
                    </svg>
                    English
                  </Link>
                </li>
                <hr className="mt-4 mb-1" />
                <li onClick={handleClickOpen}>
                  <Link className="dropdown-item" to="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12.2259 19.2554H8.00506C6.85799 19.2554 5.92728 18.3213 5.92728 17.1776V7.00507C5.92728 5.85799 6.86142 4.92728 8.00506 4.92728H12.2946C12.5522 4.92728 12.7582 4.72122 12.7582 4.46364C12.7582 4.20606 12.5522 4 12.2946 4H8.00506C6.34627 4 5 5.3497 5 7.00507V17.1776C5 18.8364 6.3497 20.1827 8.00506 20.1827H12.2259C12.4835 20.1827 12.6895 19.9766 12.6895 19.7191C12.6895 19.4615 12.48 19.2554 12.2259 19.2554Z"
                        fill="#434656"
                        stroke="#434656"
                        strokeWidth="0.2"
                      />
                      <path
                        d="M19.8631 11.7658L16.9164 8.81913C16.7344 8.63711 16.4425 8.63711 16.2604 8.81913C16.0784 9.00115 16.0784 9.29307 16.2604 9.4751L18.4172 11.6319H9.01051C8.75294 11.6319 8.54688 11.8379 8.54688 12.0955C8.54688 12.3531 8.75294 12.5592 9.01051 12.5592H18.4172L16.2604 14.7159C16.0784 14.898 16.0784 15.1899 16.2604 15.3719C16.3497 15.4612 16.4699 15.5093 16.5867 15.5093C16.7035 15.5093 16.8237 15.4646 16.913 15.3719L19.8597 12.4252C20.0451 12.2398 20.0451 11.9444 19.8631 11.7658Z"
                        fill="#434656"
                        stroke="#434656"
                        strokeWidth="0.2"
                      />
                    </svg>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
      <Logout open={open} handleClose={handleClose} />
    </>
  )
}
