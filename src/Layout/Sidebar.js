import React from "react";
import { Link } from "react-router-dom";
import SideBarLink from "./SideBarLink";
import { Activitytag, BageSvg, DashboardSvg, DeleverySvg, DriverSvg, MediaSvg, NotificationAlert, RestaurantSvg, ReviewSvg, TagSvg, UserSvg } from "../SvgFile/Index";
import Logout from "../Component/Auth/Logout";

export default function Sidebar() {
  const [links, setLinks] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const admin_links = [
    {
      link: "/admin/dashborad",
      title: "Dashboard",
      icone: <DashboardSvg />,
    },
    {
      link: "/admin/restaurant",
      title: "Restaurant",
      icone: <RestaurantSvg />,
    },
    {
      link: "/admin/drivers",
      title: "Driver",
      icone: <DriverSvg />,
    },
    {
      link: "/admin/users",
      title: "User",
      icone: <UserSvg />,
    },
    // {
    //   link: "/admin/category",
    //   title: "Category",
    //   icone: <CategorySvg/>,
    // },
    {
      link: "/admin/logo",
      title: "Delivery Logo",
      icone: <DeleverySvg />,
    },
    {
      link: "/admin/media",
      title: "Media Logo",
      icone: <MediaSvg />,
    },
    {
      link: "/admin/notificationAlert",
      title: "Notification Alert",
      icone: <NotificationAlert />,
    },
    {
      link: "/admin/tags",
      title: "Menu item tags",
      icone: <TagSvg />,
    },
    {
      link: "/admin/trackUrlactivity",
      title: "Track User Activity",
      icone: <Activitytag />,
    },
    {
      link: "/admin/nfctrack",
      title: "Nfc Track Activity",
      icone: <Activitytag />,
    },
    {
      link: "/admin/getbadge",
      title: "Badge Listing",
      icone: <BageSvg />,
    },
    {
      link: "/admin/review",
      title: "Review",
      icone: <ReviewSvg />,
    },
  ];
  React.useEffect(() => {
    setLinks(admin_links);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div id="logo">
        <img src="/image/logo.png" className="img-fluid" alt="" />
      </div>
      <div id="left-menu">
        <div className="topsmtitle">
          <h6 className="mb-0">ADMIN DASHBOARD</h6>
        </div>
        <ul className="left-nav">
          {links.map((item, i) => {
            return (
              <SideBarLink
                key={i}
                href={item.link}
                name={item.title}
                icon={item.icone}
              />
            );
          })}
          <li onClick={handleClickOpen}>
            <Link to="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12.59 13L10.29 15.29C10.1963 15.383 10.1219 15.4936 10.0711 15.6154C10.0203 15.7373 9.9942 15.868 9.9942 16C9.9942 16.132 10.0203 16.2627 10.0711 16.3846C10.1219 16.5064 10.1963 16.617 10.29 16.71C10.383 16.8037 10.4936 16.8781 10.6154 16.9289C10.7373 16.9797 10.868 17.0058 11 17.0058C11.132 17.0058 11.2627 16.9797 11.3846 16.9289C11.5064 16.8781 11.617 16.8037 11.71 16.71L15.71 12.71C15.801 12.6149 15.8724 12.5028 15.92 12.38C16.02 12.1365 16.02 11.8635 15.92 11.62C15.8724 11.4972 15.801 11.3851 15.71 11.29L11.71 7.29C11.6168 7.19676 11.5061 7.1228 11.3842 7.07234C11.2624 7.02188 11.1319 6.99591 11 6.99591C10.8681 6.99591 10.7376 7.02188 10.6158 7.07234C10.4939 7.1228 10.3832 7.19676 10.29 7.29C10.1968 7.38324 10.1228 7.49393 10.0723 7.61575C10.0219 7.73757 9.99591 7.86814 9.99591 8C9.99591 8.13186 10.0219 8.26243 10.0723 8.38425C10.1228 8.50607 10.1968 8.61676 10.29 8.71L12.59 11H3C2.73478 11 2.48043 11.1054 2.29289 11.2929C2.10536 11.4804 2 11.7348 2 12C2 12.2652 2.10536 12.5196 2.29289 12.7071C2.48043 12.8946 2.73478 13 3 13H12.59ZM12 2C10.1311 1.99166 8.29724 2.50721 6.70647 3.48819C5.11569 4.46917 3.83165 5.87631 3 7.55C2.88065 7.7887 2.86101 8.06502 2.94541 8.3182C3.0298 8.57137 3.21131 8.78065 3.45 8.9C3.68869 9.01935 3.96502 9.03899 4.2182 8.9546C4.47137 8.8702 4.68065 8.68869 4.8 8.45C5.43219 7.17332 6.39383 6.08862 7.58555 5.30799C8.77727 4.52736 10.1558 4.07912 11.5788 4.00959C13.0017 3.94007 14.4174 4.25178 15.6795 4.91251C16.9417 5.57324 18.0045 6.55903 18.7581 7.768C19.5118 8.97696 19.9289 10.3652 19.9664 11.7894C20.0039 13.2135 19.6605 14.6218 18.9715 15.8688C18.2826 17.1158 17.2731 18.1562 16.0475 18.8824C14.8219 19.6087 13.4246 19.9945 12 20C10.5089 20.0065 9.04615 19.5924 7.77969 18.8052C6.51323 18.0181 5.49435 16.8899 4.84 15.55C4.72065 15.3113 4.51137 15.1298 4.2582 15.0454C4.00502 14.961 3.72869 14.9807 3.49 15.1C3.25131 15.2193 3.0698 15.4286 2.98541 15.6818C2.90101 15.935 2.92065 16.2113 3.04 16.45C3.83283 18.0455 5.03752 19.4002 6.52947 20.374C8.02142 21.3479 9.74645 21.9054 11.5261 21.989C13.3058 22.0726 15.0755 21.6792 16.6521 20.8495C18.2288 20.0198 19.5552 18.784 20.4941 17.2698C21.433 15.7557 21.9503 14.0181 21.9925 12.237C22.0347 10.4559 21.6003 8.69579 20.7342 7.13883C19.8682 5.58187 18.6018 4.28457 17.0663 3.38111C15.5307 2.47765 13.7816 2.00084 12 2Z"
                  fill="#8F8F8F"
                />
              </svg>
              Logout
            </Link>
          </li>
        </ul>
        {/* <div className="topsmtitle">
          <h6 className="mb-0">Today’s meetings</h6>
          <ul className="sideli mt-3">
            <li>Time | Restaurant Name</li>
          </ul>
        </div> */}
        {/* <div className="topsmtitle">
          <h6 className="mb-0">Calendar</h6>
          <figure className="mb-0 mt-3">
            <img src="/image/calender.png" className="img-fluid" alt="" />
          </figure>
        </div> */}
      </div>
      <Logout open={open} handleClose={handleClose} />
    </>
  );
}
