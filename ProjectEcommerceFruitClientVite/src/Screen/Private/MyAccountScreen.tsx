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
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import { Link } from "react-router-dom";
import ProductGIList from "../Shopping/GI/ProductGIList";
import { RoutePath } from "../../constants/RoutePath";
import AddressList from "../address/AddressList";
import MyOrderList from "../order/MyOrderList";
import EditAccount from "../my/EditAccount";
import DashboardForUser from "../my/DashboardForUser";
import MyOrderToSendList from "../order/MyOrderToSendList";

const drawerWidth = 240;

const MyAccountScreen = () => {
  const { getAddressByUserId } = useStore().addressStore;
  const { getUserDetailbyId } = useStore().userStore;
  const { order, getOrdersByUser, getMyOrderToSend } = useStore().orderStore;

  const [screenComponent, setScreenComponent] = useState("my-dashboard");

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
        <ListItem
          style={{
            cursor: "pointer",
          }}
          onClick={() => setScreenComponent("my-dashboard")}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="แดชบอร์ด" />
        </ListItem>

        <ListItem
          style={{
            cursor: "pointer",
          }}
          onClick={() => setScreenComponent("my-account")}
        >
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
        <ListItem
          style={{
            cursor: "pointer",
          }}
          onClick={() => setScreenComponent("addressList")}
        >
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="ที่อยู่" />
        </ListItem>
        <ListItem
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setScreenComponent("orderList");
            getOrdersByUser();
          }}
        >
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText primary="คำสั่งซื้อ" />
        </ListItem>

        <ListItem
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setScreenComponent("orderToSendList");
            getMyOrderToSend();
          }}
        >
          <ListItemIcon>
            <DirectionsBikeIcon />
          </ListItemIcon>
          <ListItemText primary="สร้างรายได้" />
        </ListItem>
      </List>
      <Divider orientation="vertical" flexItem sx={{ height: "100vh" }} />
    </Box>
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
