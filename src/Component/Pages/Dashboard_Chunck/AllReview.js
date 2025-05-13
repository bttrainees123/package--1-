import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { defaultConfig } from '../../../config'
import { ApiLoder, ErrorMessage, SuccessMessage } from '../../../helpers/common';
import { callAPI } from '../../../utils/apiUtils';
import { apiUrls } from '../../../utils/apiUrls';
import moment from 'moment';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

export default function AllReview({ dasboardData, DashboardListAPI }) {
  const [counter, setCounter] = useState(1);
  const [loder, setLoder] = useState(false);
  const [items, setitems] = useState([]);
  const [show, setShow] = useState(false);
  const [ItemList, setItemList] = useState(dasboardData?.reviewList?.data);

  const nextTab = async () => {
    await DashboardListAPI(counter + 1)
    setCounter(counter + 1)
    setShow(false)
  }
  const backtab = async () => {
    await DashboardListAPI(counter - 1)
    setCounter(counter - 1)
    setShow(false)
  }
  useEffect(() => {
    if (dasboardData?.reviewList?.data) {
      setItemList(dasboardData?.reviewList?.data)
    }
  }, [dasboardData])

  const handelChange = (e, val) => {
    const data = ItemList?.map((item) => {
      if (item?._id === val?._id) {
        item[e.target.name] = e.target.value
      }
      return item;

    })
    setItemList(data);

  }


  const PostReview = async (id, status) => {
    try {
      setLoder(true)
      let body = {
        user_id: ItemList[0]?.user_id,
        status: status,
        id: id,
        restaurantName: ItemList[0]?.restaurantName,
        review: ItemList[0]?.review,
        receipt: ItemList[0]?.receipt,
        items: ItemList[0]?.items,
        restaurantAddress: ItemList[0]?.restaurantAddress,
        receiptNumber: ItemList[0]?.receiptNumber,
        message: ItemList[0]?.message,
        dateAndTime: ItemList[0]?.dateAndTime,
        total_price: ItemList[0]?.total_price
      }
        ;
      const apiResponse = await callAPI(apiUrls.approveRejectReview, {}, "POST", body);
      setLoder(false)
      if (apiResponse?.data?.status) {
        SuccessMessage(apiResponse?.data?.message)
        await DashboardListAPI(1)
        setCounter(1)
        setShow(false)
      } else {
        ErrorMessage(apiResponse?.data?.message)
      }

    } catch (error) {
      setLoder(false)
      ErrorMessage(error?.message)
    }
  }

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results)
  }

  const handleOnHover = (result) => {
    // the item hovered
    //console.log(result)
  }



  const handleOnSelect = (items) => {

    const data = ItemList?.map((item) => {
      item["restaurantName"] = items.name;
      item["restaurantAddress"] = items.address;

      return item;

    })
    setItemList(data);
  }

  const handleOnFocus = () => {
    console.log('Focused')
  }

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: 'block', textAlign: 'left' }}>{item?.name}</span>
      </>
    )
  }

  const RestaurantListAPI = async (page, rowsPerPage, search) => {

    try {
      let query = { search: search, page: page ? page : 1, limit: rowsPerPage ? rowsPerPage : 100 };
      const apiResponse = await callAPI(apiUrls.restaurantList, query, "GET");
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.rerstaurantList?.length > 0) {
          setitems(apiResponse.data.data?.rerstaurantList)
        } else setitems([])

      } else {
        ErrorMessage(apiResponse?.data?.message)
      }

    } catch (error) {

      ErrorMessage(error?.message)
    }
  }
  useEffect(() => {
    RestaurantListAPI();
  }, [])



  return (
    <>
      {loder && <ApiLoder />}
      {dasboardData?.reviewList?.data.length > 0 &&
        <div className="tablecard mb-30">
          <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
            <h2 className="mb-0">Pending Review #{dasboardData?.reviewList?.count}</h2>
            <figure className="mb-0">
              <img src="/image/downimg.png" className="img-fluid" alt="" />
            </figure>
          </div>
          {dasboardData?.reviewList?.data !== undefined && dasboardData?.reviewList?.data?.length > 0 && dasboardData?.reviewList?.data?.map((val, i) => (
            <div className="contentdivbox gap-4 d-flex" key={i}>
              <figure>
                <img src={defaultConfig.imagePath + val?.receipt} className="img-fluid" alt="" onClick={(() => window.open(defaultConfig.imagePath + val?.receipt))} />
              </figure>
              <div className="contentdivbox_content flex-grow-1 d-flex flex-column">
                <div className="d-flex flexcustom gap-3 onedivi">
                  <div className="itemdivboxone">
                    <h6>Time Received</h6>
                    <p>{moment(val?.createdAt).format('hh:mm A')}</p>
                  </div>
                  <div className="itemdivboxone">
                    <h6>Date Received</h6>
                    <p>{moment(val?.createdAt).format('MM/DD/YYYY')}</p>
                  </div>
                  <div className="itemdivboxone">
                    <h6>Restaurant Name</h6>
                    {val?.restaurantName}
                    <ReactSearchAutocomplete
                      items={items}
                      onSearch={handleOnSearch}
                      onHover={handleOnHover}
                      onSelect={handleOnSelect}
                      onFocus={handleOnFocus}
                      formatResult={formatResult}
                    />
                    {/* <input
           type="text"
           className="form-control"
           placeholder="Enter Name"
           name='restaurantName'
           value={val?.restaurantName}
           onChange={(e) => { handelChange(e, val) }}
         /> */}
                  </div>
                </div>
                <div className="">
                  <div className="d-flex justify-content-between flexcustom gap-3 onedivi">
                    <div className="itemdivboxone">
                      <h6>Receipt Number</h6>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Number"
                        name='receiptNumber'
                        value={val?.receiptNumber}
                        onChange={(e) => { handelChange(e, val) }}
                      />
                    </div>
                    <div className="itemdivboxone">
                      <h6>User Id</h6>
                      <p>{val?.userData[0]?.name?.toUpperCase()}</p>
                    </div>
                    <div className="itemdivboxone">
                      <h6>Restaurant Address</h6>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Address"
                        name='restaurantAddress'
                        value={val?.restaurantAddress}
                        onChange={(e) => { handelChange(e, val) }}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between flexcustom gap-3 onedivi mt-4">
                    <div className="itemdivboxone">
                      <h6>Ocr Time</h6>
                      <p>{val?.dateAndTime ? moment(val?.dateAndTime).utc().format('hh:mm A') : "---"}</p>
                    </div>
                    <div className="itemdivboxone">
                      <h6>Ocr Date</h6>
                      <p>{val?.dateAndTime ? moment(val?.dateAndTime).format('MM/DD/YYYY') : '---'}</p>
                    </div>
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
                        <h1>{val?.userData[0]?.name}</h1>
                        <p>
                          {val?.review}
                        </p>
                      </div>
                    </div>

                  }
                  <div className="odr-menu my-4">
                    <h3 className="mb-0">Order Menu Items</h3>
                  </div>
                  <ul className="menupube">
                    {val?.items?.map((val, key) => (
                      <React.Fragment key={key}>
                        <li > <i className={val.status ? "fa fa-thumbs-o-up" : "fa fa-thumbs-o-down"} style={{
                          color: val.status ? '#008080' : 'red', marginRight: "5px"
                        }} aria-hidden="true"></i>{val?.item}</li>
                      </React.Fragment>
                    ))}


                  </ul>
                </div>
                <div className="d-flex flex-column gap-3">
                  <textarea
                    className="form-control"
                    id={show ? "" : "textbox"}
                    name='message'
                    value={val?.message ? val?.message : ""}
                    onChange={(e) => { handelChange(e, val) }}
                    rows={2}
                    placeholder="Type your message..."
                    defaultValue={""}
                  />
                  <div className="btndiv d-flex align-items-center justify-content-between">
                    {show ?
                      <button id="dentbtn" className="btnred" onClick={(() => PostReview(val._id, "rejected"))}>
                        Deny
                      </button> :
                      <button id="dentbtn" className="btnred" onClick={(() => setShow(true))}>
                        Deny
                      </button>
                    }


                    <div className="btndiv d-flex align-items-center gap-2">
                      {counter > 1 &&
                        <Link to="#" onClick={backtab} className="btndarkblue-outline">
                          Back
                        </Link>
                      }
                      <Link to="#" className="btndarkblue" onClick={(() => PostReview(val._id, "approved"))}>
                        Approve
                      </Link>
                      {dasboardData?.reviewList?.count !== counter &&
                        <Link to="#" onClick={nextTab} className="btndarkblue-outline">
                          next
                        </Link>
                      }

                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      }
    </>
  )
}
