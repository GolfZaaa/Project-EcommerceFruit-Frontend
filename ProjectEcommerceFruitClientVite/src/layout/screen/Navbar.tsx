import React, { useEffect, useState } from "react";
import { Typography, IconButton, Badge } from "@mui/material";
import { pathImages, RoutePath } from "../../constants/RoutePath";
import { NavLink, Router, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ButtonMui from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import MyContent from "../../component/MyContent";
import { resetScroll } from "../../api/agent";

export default observer(function Navbar() {
  const navigate = useNavigate();

  const { logout, user } = useStore().userStore;
  const { GetCartItemByUser, cartItems } = useStore().cartStore;
  const { token } = useStore().commonStore;
  const { systemSetting, getSystemSetting, loadings } =
    useStore().systemSettingStore;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const resultCartItems = cartItems.length;

  useEffect(() => {
    getSystemSetting();
    if (token) {
      GetCartItemByUser();
    }
  }, [token]);

  const handleHomeScreen = () => {
    resetScroll();
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  return (
    <div className="hiddenPrint">
      <Backdrop
        sx={(theme) => ({
          color: "#000",
          backgroundColor: "white",
          zIndex: theme.zIndex.drawer + 1,
          opacity: 1,
        })}
        open={loadings}
      >
        <CircularProgress color="inherit" />
        <p className="pl-3">กำลังโหลด</p>
      </Backdrop>

      <div>
        <nav className="fixed w-full p-4 flex justify-between items-center bg-white shadow-md z-50">
          <NavLink to={RoutePath.firstscreen}>
            {loadings ? (
              <CircularProgress />
            ) : (
              <>
                {systemSetting[0]?.image !== undefined ? (
                  <div
                    className="text-3xl leading-none"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className="lg:hidden text-2xl lg: mr-3"
                      onClick={toggleDrawer}
                    >
                      &#9776;
                    </button>

                    <div className="hidden md:flex items-center justify-start ">
                      <img
                        src={pathImages.image_web + systemSetting[0]?.image}
                        alt="image"
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                        }}
                      />
                      <p
                        className="ml-5 FontLogo font-semibold"
                        style={{ color: "#01c446" }}
                      >
                        <MyContent
                          name={systemSetting[0]?.webName}
                          fontSize="large"
                        />
                      </p>
                    </div>
                  </div>
                ) : (
                  <p>
                    <MyContent
                      name={
                        "กรุณาเพิ่มรูปภาพ และชื่อเว็บไซต์ ได้ที่ตั้งค่าระบบ"
                      }
                      fontSize="normal"
                    />
                  </p>
                )}
              </>
            )}
          </NavLink>

          <ul className="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:flex lg:mx-auto lg:items-center lg:w-auto lg:space-x-6">
            <li>
              <NavLink
                to={RoutePath.firstscreen}
                className={({ isActive }) =>
                  `text-sm ${
                    isActive
                      ? "text-blue-600 font-bold"
                      : "text-gray-400 hover:text-gray-500"
                  }`
                }
              >
                <p className="FontPublic">
                  <MyContent name={"หน้าหลัก"} fontSize="small" />
                </p>
              </NavLink>
            </li>
            <li className="text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                className="w-4 h-4 current-fill"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </li>
            <li>
              <NavLink
                to={RoutePath.homeScreen}
                onClick={handleHomeScreen}
                className={({ isActive }) =>
                  `text-sm ${
                    isActive
                      ? "text-blue-600 font-bold"
                      : "text-gray-400 hover:text-gray-500"
                  }`
                }
              >
                <p className="FontPublic">
                  <MyContent name={"สินค้า"} fontSize="small" />
                </p>
              </NavLink>
            </li>
            <li className="text-gray-300">
              {token && token && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4 current-fill"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              )}
            </li>

            {token && token && (
              <li>
                <NavLink
                  to={RoutePath.orderReceiptList}
                  className={({ isActive }) =>
                    `text-sm ${
                      isActive
                        ? "text-blue-600 font-bold"
                        : "text-gray-400 hover:text-gray-500"
                    }`
                  }
                >
                  <p className="FontPublic">
                    <MyContent name={"สร้างรายได้"} fontSize="small" />
                  </p>
                </NavLink>
              </li>
            )}

            {user?.roleId == 1 && (
              <li className="text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4 current-fill"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </li>
            )}

            {user?.roleId == 1 && (
              <li>
                <NavLink
                  to={RoutePath.dashboardAdminHomePageScreen}
                  className={({ isActive }) =>
                    `text-sm ${
                      isActive
                        ? "text-blue-600 font-bold"
                        : "text-gray-400 hover:text-gray-500"
                    }`
                  }
                >
                  <p className="FontPublic">
                    <MyContent name={"ตั้งค่าระบบ"} fontSize="small" />
                  </p>
                </NavLink>
              </li>
            )}
          </ul>

          {token ? (
            <div>
              <ButtonMui color="secondary" onClick={handleClick}>
                <Typography variant="body1" color="black">
                  <p className="FontPublic font-semibold">
                  <MyContent name={user?.fullName} fontSize="small" />
                  </p>
                </Typography>
              </ButtonMui>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <NavLink
                  to={RoutePath.myaccountScreen}
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <MenuItem onClick={handleClose}>
                  <p className="FontPublic ">
                  <MyContent name="ข้อมูลส่วนตัว" fontSize="small" />
                  </p>
                  </MenuItem>
                </NavLink>

                {user?.stores?.length ? (
                  <NavLink
                    to={RoutePath.dashboardShopScreen}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    <MenuItem onClick={handleClose}>
                    <p className="FontPublic">
                    <MyContent name={"ร้านค้า"} fontSize="small" />
                    </p>
                    </MenuItem>
                  </NavLink>
                ) : (
                  <NavLink
                    to={RoutePath.createShopScreen}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    <MenuItem onClick={handleClose}>
                    <p className="FontPublic">
                    <MyContent name={"ลงทะเบียนร้านค้า"} fontSize="small" />
                    </p>
                    </MenuItem>
                  </NavLink>
                )}

                <Divider />
                <MenuItem
                  style={{
                    color: "red",
                  }}
                  onClick={() => {
                    logout();
                    navigate(RoutePath.homeScreen);
                    handleClose();
                  }}
                >
                  <MyContent name={"ออกจากระบบ"} fontSize="small" />
                </MenuItem>
              </Menu>

              <NavLink
                to={RoutePath.cartScreen}
                style={{ textDecoration: "none" }}
              >
                <IconButton color="inherit" aria-label="cart">
                  <Badge badgeContent={resultCartItems} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </NavLink>
            </div>
          ) : (
            <div>
              <NavLink
                className="FontPublic hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-green-500 hover:bg-green-700 text-sm text-white font-bold  rounded-xl transition duration-200"
                to={RoutePath.loginScreen}
              >
                <MyContent name={"เข้าสู่ระบบ"} fontSize="small" />
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleDrawer}
      ></div>

      <div
        className={`fixed inset-0 bg-slate-50 w-64 p-4 z-50 transition-transform ${
          drawerOpen ? "transform-none" : "transform -translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-5 mt-5">
          <NavLink
            to={RoutePath.firstscreen}
            className={({ isActive }) =>
              `text-sm ${
                isActive
                  ? "text-blue-600 font-bold"
                  : "text-gray-400 hover:text-gray-500"
              }`
            }
          >
            <MyContent name={"หน้าหลัก"} fontSize="normal" />
          </NavLink>
          <NavLink
            to={RoutePath.homeScreen}
            className={({ isActive }) =>
              `text-sm ${
                isActive
                  ? "text-blue-600 font-bold"
                  : "text-gray-400 hover:text-gray-500"
              }`
            }
          >
            <MyContent name={"สินค้า"} fontSize="normal" />
          </NavLink>
          {user && user && (
            <NavLink
              to={RoutePath.orderReceiptList}
              className={({ isActive }) =>
                `text-sm ${
                  isActive
                    ? "text-blue-600 font-bold"
                    : "text-gray-400 hover:text-gray-500"
                }`
              }
            >
              <MyContent name={"สร้างรายได้"} fontSize="normal" />
            </NavLink>
          )}

          {user?.roleId == 1 && (
            <NavLink
              to={RoutePath.dashboardAdminHomePageScreen}
              className={({ isActive }) =>
                `text-sm ${
                  isActive
                    ? "text-blue-600 font-bold"
                    : "text-gray-400 hover:text-gray-500"
                }`
              }
            >
              <MyContent name={"ตั้งค่าระบบ"} fontSize="normal" />
            </NavLink>
          )}
        </div>
      </div>
      <div className="border border-gray-200 mb-20"></div>
    </div>
  );
});
