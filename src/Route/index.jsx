import React from 'react';
import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { configureFakeBackend, authHeader, handleResponse } from '../Services/fack.backend';
import Callback from '../Auth/Callback';
import Loader from '../Layout/Loader';
import LayoutRoutes from '../Route/LayoutRoutes';
import Signin from '../Auth/Signin';
import PrivateRoute from './PrivateRoute';
import { classes } from '../Data/Layouts';
import { authRoutes } from './AuthRoutes';
import ForgetPwd from '../Components/Pages/Auth/ForgetPwd';
import withAuth from '../Auth/withAuth';

// setup fake backend
configureFakeBackend();
const Routers = () => {
  const login = useState(JSON.parse(localStorage.getItem('login')))[0];
  const [authenticated, setAuthenticated] = useState(false);
  const jwt_token = localStorage.getItem('token');
  const defaultLayoutObj = classes.find((item) => Object.values(item).pop(1) === 'compact-wrapper');
  const layout = localStorage.getItem('layout') || Object.keys(defaultLayoutObj).pop();
  const AuthLayout = LayoutRoutes//pass this --->
  useEffect(() => {
    let abortController = new AbortController();
    const requestOptions = { method: 'GET', headers: authHeader() };
    fetch('/users', requestOptions).then(handleResponse);
    setAuthenticated(JSON.parse(localStorage.getItem('authenticated')));
   
    return () => {
      abortController.abort();
    };
  }, []);


  return (
    <BrowserRouter basename={'/'}>
      <>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path={'/'} >
              {/* {login || authenticated || jwt_token ? (
                <> */}
              {/* <Route exact path={`${process.env.PUBLIC_URL}`} element={<Navigate to={`${process.env.PUBLIC_URL}/pages/sample-page/${layout}`} />} /> */}
              <Route exact path={`/`} element={<Navigate to={`${process.env.PUBLIC_URL}login`} />} />
              {/* </>
              ) : (
                ''
              )} */}
              <Route path={`/*`} element={<AuthLayout />} />
              {/* <------------------------------------ */}
            </Route>
            <Route path={`${process.env.PUBLIC_URL}/callback`} render={() => <Callback />} />
            <Route exact path={`${process.env.PUBLIC_URL}/login`} element={<Signin />} />
            <Route path={`${process.env.PUBLIC_URL}/forgot-password`} element={<ForgetPwd />} />
            {authRoutes.map(({ path, Component }, i) => (
              <Route path={path} element={(Component)} key={i} />
            ))}
          </Routes>
        </Suspense>
      </>
    </BrowserRouter>
  );
};

export default Routers;
