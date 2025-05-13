import React from 'react'
import { NavLink } from 'react-router-dom'

export default function SideBarLink({ href, name, icon }) {

  return (
    <>
      <li>
        <NavLink to={href} className={({ isActive, isPending }) =>
          isPending ? "" : isActive ? "active" : ""
        }>
          {icon}
          {name}
        </NavLink>
      </li>
    </>
  )
}
