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
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import { Link } from "react-router-dom";
import ProductGIList from "../Shopping/GI/ProductGIList";
import { RoutePath } from "../../constants/RoutePath";
import AddressList from "../address/AddressList";
import MyOrderList from "../order/MyOrderList";
import EditAccount from "../my/EditAccount";

const drawerWidth = 240;

const MyAccountScreen = () => {
  const { getAddressByUserId } = useStore().addressStore;
  const { getUserDetailbyId } = useStore().userStore;

  const [screenComponent, setScreenComponent] = useState("my-account");

  useEffect(() => {
    getAddressByUserId();
    getUserDetailbyId();
  }, []);

  const renderScreens = () => {
    switch (screenComponent) {
      case "addressList":
        return <AddressList />;
      case "orderList":
        return <MyOrderList />;
      case "my-account":
        return <EditAccount />;
      default:
    }
  };

  const drawer = (
    <>
      <div>
        {/* <Toolbar /> */}
        {/* <Divider /> */}
        <List
          style={{
            cursor: "pointer",
          }}
        >
          <ListItem onClick={() => setScreenComponent("my-account")}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="ข้อมูลส่วนตัว" />
          </ListItem>
          <Collapse timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem component={Link} to={RoutePath.firstscreen}>
                <ListItemText primary="my account Home" sx={{ pl: 4 }} />
              </ListItem>
            </List>
          </Collapse>
          <ListItem onClick={() => setScreenComponent("addressList")}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="ที่อยู่" />
          </ListItem>
          <ListItem onClick={() => setScreenComponent("orderList")}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="คำสั่งซื้อ" />
          </ListItem>
        </List>
      </div>
      <Divider orientation="vertical" />
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        {/* <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
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
            },
          }}
          open
        >
          {drawer}
        </Drawer> */}
        {drawer}
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
        {renderScreens()}
      </Box>
    </Box>
  );
};

export default observer(MyAccountScreen);
