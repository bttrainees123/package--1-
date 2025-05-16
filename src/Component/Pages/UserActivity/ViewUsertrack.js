import React, { useEffect, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import { ApiLoder, ErrorMessage } from "../../../helpers/common";
import { apiUrls } from "../../../utils/apiUrls";
import Topbar from "../../../Layout/Topbar";
import { useParams } from "react-router-dom";
import moment from "moment";

export default function ViewUsertrack() {
  const [loder, setLoader] = useState(false);
  const [logoList, setLogoList] = useState([]);
  const param = useParams();

  const LogoListAPI = async () => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.urlDetail,
        { urlId: param.id },
        "GET"
      );
      if (apiResponse?.data?.status === true) {
        if (apiResponse?.data?.data?.length > 0) {
          setLogoList(apiResponse.data.data);
        } else {
          setLogoList([]);
        }
      } else {
        ErrorMessage(apiResponse?.data?.message);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      ErrorMessage(error?.message);
    }
  };

  useEffect(() => {
    LogoListAPI();
  }, []);

  const groupByUser = (activities = []) => {
    return activities.reduce((acc, activity) => {
      const userId = activity.userId;
      const visitDate = new Date(activity.visitDate).toLocaleString();
      if (!acc[userId]) {
        acc[userId] = {
          name: activity.userDetails.name,
          mobileno: activity.userDetails.mobileno,
          visits: [],
        };
      }
      acc[userId].visits.push({ visitDate });
      return acc;
    }, {});
  };

  const groupedData = groupByUser(logoList[0]?.users || []);
  const data = [];

  // Prepare data for the graph
  Object.keys(groupedData).forEach((userId) => {
    groupedData[userId].visits.forEach((visit, index) => {
      data.push({
        name: groupedData[userId].name,
        mobileno: groupedData[userId].mobileno,
        visitDate: `${moment(visit.visitDate).format("MM/DD/YYYY")} ${moment(
          visit.visitDate
        )
          .utc()
          .format("hh:mm A")}`,
        visitCount: index + 1,
      });
    });
  });

  const groupByIp = (activities = []) => {
    return activities.reduce((acc, activity) => {
      const userIp = activity.userIp;
      if (!acc[userIp]) {
        acc[userIp] = { visits: [] };
      }
      acc[userIp].visits.push(activity.visitDate);
      return acc;
    }, {});
  };

  const groupedUnknownData = groupByIp(logoList[0]?.unknownUser || []);

  const datass = [];

  // Prepare data for the graph
  Object.keys(groupedUnknownData).forEach((userIp) => {
    groupedUnknownData[userIp].visits.forEach((visitDate, index) => {
      datass.push({
        name: userIp, // Use the IP address as the name
        visitDate: `${moment(visitDate).format("MM/DD/YYYY")} ${moment(
          visitDate
        )
          .utc()
          .format("hh:mm A")}`, // Directly use visitDate as it is already a string
        visitCount: index + 1,
      });
    });
  });

  return (
    <>
      <div id="page-container" className="page_contclass">
        <Topbar
          Title="Track Url Activity"
          Subtitle="Track Url Activity"
        ></Topbar>
        <div className="inner-main-content">
          {loder && <ApiLoder />}
          <div className="tablecard mb-30">
            <div className="tableheader d-flex align-items-center justify-content-between boderbtn">
              <h2 className="mb-0">
                {logoList[0]?.url}
              </h2>
            </div>
            <div className="container-fluid mt-4">
              <div className="row mt-4">
                {/* Left Column: Registered Users */}
                <div className="col-md-6">
                  <h2>User Track Activity ({Object.entries(groupedData)?.length})</h2>
                  <div className="accordion p-4" id="userAccordion">
                    {Object.entries(groupedData).map(
                      ([userId, user], index) => (
                        <div className="accordion-item" key={userId}>
                          <h2
                            className="accordion-header"
                            id={`heading-${index}`}
                          >
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse-${index}`}
                              aria-expanded="false"
                              aria-controls={`collapse-${index}`}
                            >
                              {user.name} - {user.mobileno} (
                              {user.visits.length} time visits)
                            </button>
                          </h2>
                          <div
                            id={`collapse-${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading-${index}`}
                            data-bs-parent="#userAccordion"
                          >
                            <div className="accordion-body p-2 bg-gray-50 rounded-lg shadow-inner">
                              <ul className="space-y-2">
                                {user.visits.map((v, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-blue-50 transition"
                                  >
                                    <div className="text-blue-600 font-semibold text-lg">
                                      {i + 1}.
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-700">
                                        {moment(v.visitDate).format(
                                          "MM/DD/YYYY hh:mm A"
                                        )}
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Right Column: Unknown Users */}
                <div className="col-md-6">
                  <h2>Unknown User Track Activity ({Object.entries(groupedUnknownData)?.length})</h2>
                  <div className="accordion p-4" id="unknownAccordion">
                    {Object.entries(groupedUnknownData).map(
                      ([ip, data], index) => (
                        <div className="accordion-item" key={ip}>
                          <h2
                            className="accordion-header"
                            id={`unk-heading-${index}`}
                          >
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#unk-collapse-${index}`}
                              aria-expanded="false"
                              aria-controls={`unk-collapse-${index}`}
                            >
                              IP: {ip} ({data.visits.length} time visits)
                            </button>
                          </h2>
                          <div
                            id={`unk-collapse-${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`unk-heading-${index}`}
                            data-bs-parent="#unknownAccordion"
                          >
                            <div className="accordion-body p-2 bg-gray-50 rounded-lg shadow-inner">
                              <ul className="space-y-2">
                                {data.visits.map((visitDate, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-blue-50 transition"
                                  >
                                    <div className="text-blue-600 font-semibold text-lg">
                                      {i + 1}.
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-700">
                                        {moment(visitDate).format(
                                          "MM/DD/YYYY hh:mm A"
                                        )}
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
