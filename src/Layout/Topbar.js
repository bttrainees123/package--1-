import React from 'react'
import { Link } from 'react-router-dom'

export default function Topbar(props) {
  return (
    <>
      <div className="top-title-sec d-flex align-items-center justify-content-between mb-30">
        <h1 className="heading24 mb-0">{props.Title}</h1>

        <div className="d-flex align-items-center gap-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 custbread">
              <li className="breadcrumb-item">
                <Link to="/admin/dashborad">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {props.Subtitle}{" "}
              </li>
            </ol>
          </nav>
          {props.children}
        </div>
      </div>
    </>
  )
}
