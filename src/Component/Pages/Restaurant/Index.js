import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Topbar from '../../../Layout/Topbar'
import AddRestaurant from './AddRestaurant'
import OutnetworkResturent from './OutnetworkResturent';
import { PlushSvg } from '../../../SvgFile/Index';
import { callAPI } from '../../../utils/apiUtils';
import { apiUrls } from '../../../utils/apiUrls';
import { ErrorMessage } from '../../../helpers/common';

export default function Index() {
  const [media, setMedia] = useState([])
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [logoList, setLogoList] = useState([]);
  const [TagsData, setTagsData] = useState([])
  const tagApi = async () => {
    try {
      let query = {};
      const apiResponse = await callAPI(apiUrls.tagList, query, "GET");
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.length > 0) {
          setTagsData(apiResponse.data.data)
        }
        else {
          setTagsData([])
        }
      } else {
        ErrorMessage(apiResponse?.data?.message)
      }
    } catch (error) {
      ErrorMessage(error?.message)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmitApi = () => {
    setUpdate(true)
  }

  const LogoListAPI = async () => {
    try {
      let query = {};
      const apiResponse = await callAPI(apiUrls.logoread + "/active", query, "GET");
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.length > 0) {
          setLogoList(apiResponse.data.data)
        }
        else {
          setLogoList([])
        }
      } else {
        ErrorMessage(apiResponse?.data?.message)
      }
    } catch (error) {
      ErrorMessage(error?.message)
    }
  }

  const medaiListAPI = async () => {
    try {
      let query = {};
      const apiResponse = await callAPI(apiUrls.mediaGetActive, query, "GET");
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.length > 0) {
          setMedia(apiResponse.data.data)
        }
        else {
          setMedia([])
        }
      } else {
        ErrorMessage(apiResponse?.data?.message)
      }
    } catch (error) {
      ErrorMessage(error?.message)
    }
  }
  
  useEffect(() => {
    LogoListAPI();
    medaiListAPI();
    tagApi()
  }, [])

  return (
    <>
      <div id="page-container" className="page_contclass">
        <Topbar Title="Restaurant" Subtitle="restaurant">
          <Link to="#" onClick={(() => setOpen(true))}
            className="creatbtn d-flex align-items-center justify-content-center gap-2"
          >
            <PlushSvg />
            Create Restaurant
          </Link>
        </Topbar>
        <div className="inner-main-content">
          <OutnetworkResturent update={update} logoList={logoList} type="inNetwork" mediaList={media} />
          <OutnetworkResturent update={update} logoList={logoList} type="outNetwork" mediaList={media} />
        </div>
      </div>
      <AddRestaurant open={open} handleClose={handleClose} handleSubmitApi={handleSubmitApi} logoList={logoList} TagsListingData={TagsData} mediaList={media} />
    </>
  )
}
