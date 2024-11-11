import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";
import { RoutePath } from "../../../constants/RoutePath";
import DashboardAdminShowUser from "./DashboardAdminShowUser";
import DashboardAdminShowStore from "./DashboardAdminShowStore";
import { useStore } from "../../../store/store";
import DashboardAdminShowProduct from "./DashboardAdminShowProduct";
import DashboardAdminShowProductGI from "./DashboardAdminShowProductGI";
import DashboardAdminShowOrder from "./DashboardAdminShowOrder";
import DashboardAdminShowSystemSetting from "./DashboardAdminShowSystemSetting";
import DashboardAdminSlideShow from "./DashboardAdminSlideShow";
import DashboardAdminNEWS from "./DashboardAdminNEWS";
import { FaBoxOpen, FaClipboardList, FaStore, FaUser } from "react-icons/fa6";
import { GiCardboardBox } from "react-icons/gi";
import { FaCog, FaImage, FaNewspaper } from "react-icons/fa";
import MyContent from "../../../component/MyContent";

const drawerWidth = 240;

export default observer(function DashboardAdminHomePageScreen() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getStoreAll } = useStore().shopuserStore;
  const { getProduct } = useStore().productStore;
  const { getOrdersAll } = useStore().orderStore;
  const { getSystemSetting } = useStore().systemSettingStore;

  useEffect(() => {
    getSystemSetting();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [screenComponent, setScreenComponent] = useState(
    "DashboardAdminShowUser"
  );

  const renderScreens = () => {
    switch (screenComponent) {
      case "DashboardAdminShowUser":
        return <DashboardAdminShowUser />;
      case "DashboardAdminShowStore":
        return <DashboardAdminShowStore />;
      case "DashboardAdminShowProduct":
        return <DashboardAdminShowProduct />;
      case "DashboardAdminShowProductGI":
        return <DashboardAdminShowProductGI />;
      case "DashboardAdminShowOrder":
        return <DashboardAdminShowOrder />;
      case "DashboardAdminShowSystemSetting":
        return <DashboardAdminShowSystemSetting />;
      case "DashboardAdminSlideShow":
        return <DashboardAdminSlideShow />;
      case "DashboardAdminNEWS":
        return <DashboardAdminNEWS />;
      default:
        return null;
    }
  };

  const handleDashboardAdminShowStore = () => {
    getStoreAll();
    setScreenComponent("DashboardAdminShowStore");
  };

  const handleDashboardAdminShowProduct = () => {
    getProduct(0);
    setScreenComponent("DashboardAdminShowProduct");
  };

  const handleDashboardAdminShowProductGI = () => {
    setScreenComponent("DashboardAdminShowProductGI");
  };

  const handleDashboardAdminShowOrder = () => {
    getOrdersAll();
    setScreenComponent("DashboardAdminShowOrder");
  };

  const handleDashboardAdminShowSystemSetting = () => {
    getSystemSetting();
    setScreenComponent("DashboardAdminShowSystemSetting");
  };

  const handleDashboardAdminSlideShow = () => {
    setScreenComponent("DashboardAdminSlideShow");
  };

  const handleDashboardAdminNEWS = () => {
    setScreenComponent("DashboardAdminNEWS");
  };

  const drawer = (
    <div>
      <Toolbar sx={{ minHeight: 0 }} />
      <Divider />
      <List
        style={{
          cursor: "pointer",
          marginTop: "15px"
        }}
      >
        <ListItem onClick={() => setScreenComponent("DashboardAdminShowUser")}>
          <ListItemIcon>
            <FaUser className="text-2xl" />
          </ListItemIcon>
          <ListItemText primary="ข้อมูลผู้ใช้งาน" />
        </ListItem>
        <ListItem onClick={handleDashboardAdminShowStore}>
          <ListItemIcon>
            <FaStore className="text-2xl" />
          </ListItemIcon>
          <ListItemText primary="ข้อมูลร้านค้าทั้งหมด" />
        </ListItem>
        <ListItem onClick={handleDashboardAdminShowProduct}>
          <ListItemIcon>
            <FaBoxOpen className="text-2xl" />
          </ListItemIcon>
          <ListItemText primary="ข้อมูลสินค้าทั้งหมด" />
        </ListItem>
        <ListItem onClick={handleDashboardAdminShowProductGI}>
          <ListItemIcon>
            <GiCardboardBox className="text-2xl" />
          </ListItemIcon>
          <ListItemText primary="ข้อมูล GI ทั้งหมด" />
        </ListItem>
        <ListItem button onClick={handleDashboardAdminShowOrder}>
          <ListItemIcon>
            <FaClipboardList className="text-2xl" />
          </ListItemIcon>
          <ListItemText primary="คำสั่งซื้อสินค้าทั้งหมด" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleDashboardAdminShowSystemSetting}>
          <ListItemIcon>
            <FaCog className="text-2xl" />
          </ListItemIcon>
          <ListItemText primary="ตั้งค่าเว็บไซต์" />
        </ListItem>
        <ListItem button onClick={handleDashboardAdminSlideShow}>
          <ListItemIcon>
            <FaImage className="text-2xl" />
          </ListItemIcon>
          <ListItemText primary="รูปภาพหน้าเว็บ" />
        </ListItem>
        <ListItem button onClick={handleDashboardAdminNEWS}>
          <ListItemIcon>
            <FaNewspaper className="text-2xl" />
          </ListItemIcon>
          <ListItemText primary="ข่าวประชาสัมพันธ์" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#3f51b5",
          zIndex: (theme) => theme.zIndex.drawer,
          height: 81,
          justifyContent: "center",
        }}
      >
        <Toolbar sx={{ minHeight: 80 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            แดชบอร์ด
          </Typography>
          <NavLink
            to={RoutePath.homeScreen}
            style={{ textDecoration: "none", color: "#fff" }}
          >
            กลับหน้าหลัก
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
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          disableScrollLock={true}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
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
              width: drawerWidth,
              zIndex: (theme) => theme.zIndex.appBar - 1, 
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
        }}
      >
        <Toolbar />
        <div className="-mt-20">{renderScreens()}</div>
        
      </Box>
    </Box>
  );
});
