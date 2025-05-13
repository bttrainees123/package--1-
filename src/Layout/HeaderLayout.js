import React from 'react'
import Header from './header';
import Sidebar from './Sidebar';

export default function HeaderLayout(props) {
  return (
    <>
      <section className="bg-dashboard">
        <div className="container-fluid pl_pr">
          <div id="main-content">
            <Sidebar />
            <Header />
            {props.children}
          </div>
        </div>
      </section>
    </>
  )
}
