import React from 'react'
import { Link } from 'react-router-dom'

export default function PageNotFound() {
  return (
    <>
      <section className="banner-text text-center my-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="error-page">
                <h1 className="font_funky mb-5">Oops.</h1>
                <h2>404</h2>
                <p className="mb-5">page not found</p>
                <Link to="/" className="job-psot-btn">
                  Go to homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>

  )
}
