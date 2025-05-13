import React, { useEffect, useState } from 'react'
import { callAPI } from '../../../utils/apiUtils';
import { ApiLoder, ErrorMessage, } from '../../../helpers/common';
import { apiUrls } from '../../../utils/apiUrls';
import { EditSvg, PlushSvg } from '../../../SvgFile/Index';
import { Link } from 'react-router-dom';
import Topbar from '../../../Layout/Topbar';
import CreateNotificationAlert from './CreateNotificationAlert';
export default function Index() {
    const [open, setOpen] = useState(false);
    const [loder, setLoader] = useState(false)
    const [logoList, setLogoList] = useState([]);
    const [action, setAction] = useState("")
    const [object, setObject] = useState("")

    const LogoListAPI = async () => {
        setLoader(true)
        try {
            let query = {};
            const apiResponse = await callAPI(apiUrls.ListNotificationAlert, query, "GET");
            if (apiResponse?.data?.status === true) {
                if (apiResponse?.data?.Data?.length > 0) {
                    setLogoList(apiResponse.data.Data)
                }
                else {
                    setLogoList([])
                }
            } else {
                ErrorMessage(apiResponse?.data?.message)
            }
            setLoader(false)
        } catch (error) {
            setLoader(false)
            ErrorMessage(error?.message)
        }
    }
    const handleclose = () => {
        setOpen(false)
    }
    useEffect(() => {
        LogoListAPI();
    }, [])
    return (
        <>
            <div id="page-container" className="page_contclass">
                <Topbar Title="Alert Message" Subtitle="Alert Message">
                    {!logoList?.length > 0 &&
                        <Link to="#" onClick={(() => {
                            setAction("add")
                            setOpen(true)
                        })
                        }
                            className="creatbtn d-flex align-items-center justify-content-center gap-2"
                        >
                            <PlushSvg />
                            Create Alert Message
                        </Link>
                    }
                </Topbar>
                <div className="inner-main-content">
                    {loder && <ApiLoder />}
                    <div className="tablecard mb-30">
                        <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
                            <h2 className="mb-0">Alert Message</h2>

                        </div>
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Phone Number</th>
                                        <th>message</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(logoList !== undefined && logoList?.length > 0) ? logoList?.map((item, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{item?.phoneNumber}</td>
                                            <td>{item?.message}</td>
                                            <td className="text-start">
                                                <div className="actionbtn d-flex align-items-center justify-content-end gap-2">
                                                    <Link to="#" className="editlink" onClick={(() => {
                                                        setAction("edit")
                                                        setObject(item)
                                                        setOpen(true)
                                                    })
                                                    }>
                                                        <EditSvg />
                                                    </Link>

                                                </div>
                                            </td>

                                        </tr>
                                    )) : !loder && <tr>
                                        <td colSpan="5">
                                            <div className="no_record_text">
                                                No Record Found
                                            </div>
                                        </td>
                                    </tr>}


                                </tbody>
                            </table>

                        </div>
                    </div>

                </div>
            </div>
            <CreateNotificationAlert open={open} handleclose={handleclose} action={action} LogoListAPI={LogoListAPI} object={object} />
        </>
    )
}
