import React, { Suspense, Fragment, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderLayout from './Layout/HeaderLayout';
import Authenticated from './Guard/Authenticated';
import Guest from './Guard/Guest';
import BaseLayout from './Layout/BaseLayout';
import LoadScreen from './loaderScreen';

export function RenderRout() {

  return (
    <>
      <Router>
        <Suspense fallback={<LoadScreen />}
        >
          <Routes>
            {routes?.map((route, i) => {
              const Guard = route?.guard || Fragment;
              const Layout = route?.layout || Fragment;
              const Component = route?.element;
              return (
                <Route
                  key={i}
                  path={route.path}
                  exact={route.exact}
                  element={
                    <Guard>
                      <Layout >
                        <Component />
                      </Layout>
                    </Guard>
                  }
                />
              );
            })}
          </Routes>
        </Suspense>
      </Router>
    </>
  )

}

const routes = [
  //Auth Pages
  {
    guard: Guest,
    layout: BaseLayout,
    exact: true,
    path: '/',
    element: lazy(() => import('./Component/Auth/Login'))
  },

  //Dashboard

  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/dashborad',
    element: lazy(() => import('./Component/Pages/Dashboard'))
  },

  //Resturent
  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/restaurant',
    element: lazy(() => import('./Component/Pages/Restaurant/Index'))
  },

  //User

  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/users',
    element: lazy(() => import('./Component/Pages/Users/Index'))
  },
  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/users/history/:id',
    element: lazy(() => import('./Component/Pages/Users/UserHistory'))
  },


  //Driver

  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/drivers',
    element: lazy(() => import('./Component/Pages/Driver/Index'))
  },
  //global category
  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/category',
    element: lazy(() => import('./Component/Pages/Global_category/Index'))
  },


  //logo
  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/logo',
    element: lazy(() => import('./Component/Pages/Logo/Index'))
  },
  //notification alert
  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/notificationAlert',
    element: lazy(() => import('./Component/Pages/NotificationAlert/Index'))
  },
  //Menu
  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/restaurant/menu/:id',
    element: lazy(() => import('./Component/Pages/Menu/Index'))
  },
  //category
  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/catagory',
    element: lazy(() => import('./Component/Pages/Catagory/Index'))
  },
  //tags
  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/tags',
    element: lazy(() => import('./Component/Pages/Tag/Index'))
  },
  //track user activity
  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/trackUrlactivity',
    element: lazy(() => import('./Component/Pages/UserActivity/Index'))
  },
  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/nfctrack',
    element: lazy(() => import('./Component/Pages/UserActivity/NfcTrack'))
  },
  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/trackUrlactivity/:id',
    element: lazy(() => import('./Component/Pages/UserActivity/ViewUsertrack'))
  },
  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/nfctrack/:id',
    element: lazy(() => import('./Component/Pages/UserActivity/ViewUsertrack'))
  },
  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/review',
    element: lazy(() => import('./Component/Pages/review/Index'))
  },
  //badge
  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/getbadge',
    element: lazy(() => import('./Component/Pages/Badge/Index'))
  },

  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/upload/restaurant',
    element: lazy(() => import('./Component/Pages/UploadRestaurant/Index'))
  },



  {
    guard: Authenticated,
    layout: HeaderLayout,
    exact: true,
    path: '/admin/media',
    element: lazy(() => import('./Component/Pages/MediaLogo/Index'))
  },

  ///404 Page

  {
    layout: BaseLayout,
    exact: true,
    path: '*',
    element: lazy(() => import('./Component/PageNotFound'))

  },
]