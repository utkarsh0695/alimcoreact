import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, LogIn, Mail, User } from 'react-feather';
import man from '../../../assets/images/avtar/user-logo-balnk.png';

import { LI, UL, Image, P } from '../../../AbstractElements';
import CustomizerContext from '../../../_helper/Customizer';
import { Account, Admin, Inbox, LogOut, Taskboard } from '../../../Constant';
import { logoutAPI } from '../../../api/auth';
import { toast } from 'react-toastify';

const UserHeader = () => {
  const history = useNavigate();
  const [profile, setProfile] = useState('');
  const [name, setName] = useState(localStorage.getItem("Name"));
  const { layoutURL } = useContext(CustomizerContext);
  const authenticated = JSON.parse(localStorage.getItem('authenticated'));
  const auth0_profile = JSON.parse(localStorage.getItem('auth0_profile'));

  useEffect(() => {
    setProfile(localStorage.getItem('profileURL') || man);
    // setName(localStorage.getItem('Name') ? localStorage.getItem('Name') : name);
  }, []);
  const userDetail = JSON.parse(localStorage?.getItem("userDetail"));
  const userToken = localStorage.getItem("accessToken");
  const navigate = useNavigate()
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  const Logout = () => {
    logoutAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status === "success") {
          toast.success(res.data.message);
          localStorage.clear()
          navigate("/login",{ replace: true })
        } else {
          toast.error(res.data.message);
          navigate("/login",{ replace: true });
          localStorage.clear()
        }
      })
      .catch((err) => {
        navigate("/login",{ replace: true });
        localStorage.clear()
      });
  };


  // const Logout = () => {
  //   localStorage.removeItem('profileURL');
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('auth0_profile');
  //   localStorage.removeItem('Name');
  //   localStorage.setItem('authenticated', false);
  //   history(`${process.env.PUBLIC_URL}/login`);
  // };

  const UserMenuRedirect = (redirect) => {
    // return false
    navigate(redirect);
  };

  return (
    <li className='profile-nav onhover-dropdown pe-0 py-0'>
      <div className='media profile-media'>
        <Image
          attrImage={{
            className: 'b-r-10 m-0 sm',
            src: `${authenticated ? auth0_profile.picture : profile}`,
            alt: '',
          }}
          
        />
        <div className='media-body'>
          <span>{authenticated ? auth0_profile.name : name}</span>
          <P attrPara={{ className: 'mb-0 font-roboto' }}>
            {userDetail?.user_type=="A" ? "Admin":""}
            {userDetail?.user_type=="AC" ? "Aasra Center":""}
            {userDetail?.user_type=="CC" ? "Call Center":""}
            {userDetail?.user_type=="S" ? "Super Admin":""}
             <i className='middle fa fa-angle-down'></i>
          </P>
        </div>
      </div>
      <UL attrUL={{ className: 'simple-list profile-dropdown onhover-show-div' }}>
        <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`/user-profile`),
          }}>
          <User />
          <span>{Account} </span>
        </LI>
        {/* <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`${process.env.PUBLIC_URL}/app/email-app/${layoutURL}`),
          }}>
          <Mail />
          <span>{Inbox}</span>
        </LI> */}
        {/* <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`${process.env.PUBLIC_URL}/app/todo-app/todo/${layoutURL}`),
          }}>
          <FileText />
          <span>{Taskboard}</span>
        </LI> */}
        <LI attrLI={{ onClick: Logout }}>
          <LogIn />
          <span>{LogOut}</span>
        </LI>
      </UL>
    </li>
  );
};

export default UserHeader;
