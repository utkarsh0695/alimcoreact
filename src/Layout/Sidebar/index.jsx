import React, { Fragment, useState, useEffect, useContext } from 'react';
import CustomContext from '../../_helper/Customizer';
// import { MENUITEMS } from './Menu';
import SidebarIcon from './SidebarIcon';
import SidebarLogo from './SidebarLogo';
import SidebarMenu from './SidebarMenu';
import { dashboardAPI } from "../../api/user";
import useLogout from "../../util/useLogout";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";
const Sidebar = (props) => {
  const customizer = useContext(CustomContext);
  const { toggleIcon } = useContext(CustomContext);
  const id = window.location.pathname.split('/').pop();
  const defaultLayout = Object.keys(customizer.layout);
  const [menu, setMenu] = useState([]);
  const [icons, setIcons] = useState([]); // State to store icons
  const [isLoading, setIsLoading] = useState(true);
  const logout = useLogout();
  const fetch = async () => {
    try {
      const response = await dashboardAPI();
      if (response.data.status === "success") {
        setMenu(response.data.data.sideBar);
        // Create an array of icons
        // const iconList = response.data.data.sideBar.flatMap((item) =>
        //   item.Items.map((subItem) => subItem.icon)
        // );
        // setIcons(iconList);
         setIsLoading(false);
      } else if (response.data.status == "failed") {
        setIsLoading(false);
        toast.error(response.data.message);
      } else if (response.data.status == "expired") {
        logout(response.data.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetch();
  }, []);
  const layout = id ? id : defaultLayout;
  // eslint-disable-next-line
  const [mainmenu, setMainMenu] = useState([]);

  const [width, setWidth] = useState(0);

  const handleScroll = () => {
    if (window.scrollY > 400) {
      // if (
      //   customizer.settings.sidebar.type.split(' ').pop() ===
      //   'material-type' ||
      //   customizer.settings.sidebar.type.split(' ').pop() ===
      //   'advance-layout'
      // )
      document.querySelector('.sidebar-main').className = 'sidebar-main hovered';
    } else {
      if (document.getElementById('sidebar-main')) document.querySelector('.sidebar-main').className = 'sidebar-main';
    }
  };

  useEffect(() => {
    document.querySelector('.left-arrow').classList.add('d-none');
    window.addEventListener('resize', handleResize);
    handleResize();
    const currentUrl = window.location.pathname;
    menu.map((items) => {
      items.Items.filter((Items) => {
        if (Items.path === currentUrl) setNavActive(Items);
        if (!Items.children) return false;
        Items.children.filter((subItems) => {
          if (subItems.path === currentUrl) setNavActive(subItems);
          if (!subItems.children) return false;
          subItems.children.filter((subSubItems) => {
            if (subSubItems.path === currentUrl) {
              setNavActive(subSubItems);
              return true;
            } else {
              return false;
            }
          });
          return subItems;
        });
        return Items;
      });
      return items;
    });
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [layout]);

  const handleResize = () => {
    setWidth(window.innerWidth - 500);
  };

  const activeClass = () => {
    // document.querySelector('.sidebar-link').classList.add('active');
    document.querySelector('.bg-overlay1').classList.add('active');
  };

  const setNavActive = (item) => {
    menu.map((menuItems) => {
      menuItems.Items.filter((Items) => {
        if (Items !== item) {
          Items.active = false;
          document.querySelector('.bg-overlay1').classList.remove('active');
        }
        if (Items.children && Items.children.includes(item)) {
          Items.active = true;
          document.querySelector('.sidebar-links').classList.add('active');
        }
        if (Items.children) {
          Items.children.filter((submenuItems) => {
            if (submenuItems.children && submenuItems.children.includes(item)) {
              Items.active = true;
              submenuItems.active = true;
              return true;
            } else {
              return false;
            }
          });
        }
        return Items;
      });
      return menuItems;
    });
    item.active = !item.active;
    setMainMenu({ mainmenu: menu });
  };

  const closeOverlay = () => {
    document.querySelector('.bg-overlay1').classList.remove('active');
    document.querySelector('.sidebar-links').classList.remove('active');
  };

  return (
    <Fragment>
      <div
        className='bg-overlay1'
        onClick={() => {
          closeOverlay();
        }}></div>
      <div className={`sidebar-wrapper ${toggleIcon ? 'close_icon' : ''}`} sidebar-layout='stroke-svg'>
        <SidebarIcon />
        <SidebarLogo />
        {/* sidebartoogle={sidebartoogle} */}
        <SidebarMenu setMainMenu={setMainMenu} menu={menu} props={props} setNavActive={setNavActive} activeClass={activeClass} width={width} />
      </div>
    </Fragment>
  );
};

export default Sidebar;
