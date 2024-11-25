import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Collapse,
  IconButton,
  Drawer,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import { Link, NavLink } from "react-router-dom";
import ProductGIList from "../Shopping/GI/ProductGIList";
import { RoutePath } from "../../constants/RoutePath";
import AddressList from "../address/AddressList";
import MyOrderList from "../order/MyOrderList";
import EditAccount from "../my/EditAccount";
import DashboardForUser from "../my/DashboardForUser";
import MyOrderToSendList from "../order/MyOrderToSendList";
import SearchOrderToSendList from "../order/SearchOrderToSendList";
import EmailIcon from "@mui/icons-material/Email";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MyContent from "../../component/MyContent";
import MenuIcon from "@mui/icons-material/Menu";
import { MdDashboard, MdSpaceDashboard } from "react-icons/md";

const drawerWidth = 240;

const MyAccountScreen = () => {
  const { getAddressByUserId } = useStore().addressStore;
  const { order, getOrdersByUser, getMyOrderToSend, setOrder } =
    useStore().orderStore;

  const [screenComponent, setScreenComponent] = useState("my-dashboard");

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  useEffect(() => {
    getAddressByUserId();
  }, []);

  const renderScreens = () => {
    switch (screenComponent) {
      case "addressList":
        return <AddressList />;
      case "orderList":
        return <MyOrderList order={order} />;
      case "orderToSendList":
        return <MyOrderToSendList order={order} />;
      case "searchorderToSendList":
        return <SearchOrderToSendList />;
      case "my-account":
        return <EditAccount />;
      case "my-dashboard":
        return <DashboardForUser />;
      default:
    }
  };

  const drawer = (
    <Box sx={{ display: "flex" }}>
      <List>
        <ListItem>
          <ListItemText
            sx={{ textAlign: "center" }}
            primary={
              <p className="FontPublic font-bold after:content-[''] after:block after:w-full after:h-[1px] after:bg-current after:mt-1">
                <MyContent name="แดชบอร์ดส่วนตัว" fontSize="normal" />
              </p>
            }
          />
        </ListItem>

        <ListItem
          button
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setScreenComponent("my-dashboard");
            handleDrawerClose();
          }}
        >
          <ListItemIcon>
            <MdDashboard size={25} />
          </ListItemIcon>
          <ListItemText
            primary={
              <p className="FontPublic">
            <MyContent name="สรุปข้อมูล" fontSize="small" />
              </p>
          }
          />
        </ListItem>

        <ListItem
          button
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setScreenComponent("my-account");
            handleDrawerClose();
          }}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText
            primary={
            <p className="FontPublic">
              <MyContent name="ข้อมูลส่วนตัว" fontSize="small" />
            </p>
          }
          />
        </ListItem>

        <Collapse timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem component={Link} to={RoutePath.firstscreen}>
              <ListItemText primary="my account Home" sx={{ pl: 4 }} />
            </ListItem>
          </List>
        </Collapse>
        <ListItem
          button
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setScreenComponent("addressList");
            handleDrawerClose();
          }}
        >
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <p className="FontPublic">
            <MyContent name="ที่อยู่" fontSize="small" />
              </p>
          }
          />
        </ListItem>
        <ListItem
          button
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setScreenComponent("orderList");
            getOrdersByUser();
            handleDrawerClose();
          }}
        >
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <p className="FontPublic">
            <MyContent name="คำสั่งซื้อ" fontSize="small" />
              </p>
          }
          />
        </ListItem>

        <ListItem
          button
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setScreenComponent("orderToSendList");
            getMyOrderToSend();
            handleDrawerClose();
          }}
        >
          <ListItemIcon>
            <MonetizationOnIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <p className="FontPublic">
            <MyContent name="สร้างรายได้" fontSize="small" />
              </p>
          }
          />
        </ListItem>

        <ListItem
          button
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setScreenComponent("searchorderToSendList");
            setOrder([]);
            handleDrawerClose();
          }}
        >
          <ListItemIcon>
            <EmailIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <p className="FontPublic">
              <MyContent name="รับ-ส่งต่อ คำสั่งซื้อ" fontSize="small" />
              </p>
            }
          />
        </ListItem>
      </List>
      <Divider orientation="vertical" flexItem sx={{ height: "100vh" }} />
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ display: { sm: "none" } }}>
        <Toolbar sx={{ minHeight: 80, justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          <NavLink
            to={RoutePath.homeScreen}
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <MyContent name="กลับหน้าหลัก" fontSize="normal" />
          </NavLink>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          position: "relative",
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              position: "fixed",
              bottom: 12,
              zIndex: 1,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              position: "fixed",
              bottom: 12,
              top: 82,
              zIndex: 1,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginBottom: { xs: 8, sm: 0 },
        }}
      >
        <Toolbar />
        {renderScreens()}
      </Box>
    </Box>
  );
};

export default observer(MyAccountScreen);
