import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import imageDashboard from "../../image/DashboardShop.png";
import { Link, NavLink } from "react-router-dom";
import CreateShopScreen from "../Shopping/CreateShopScreen";
import ProductGIList from "../Shopping/GI/ProductGIList";
import ProductList from "../Shopping/product/ProductList";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import OrderList from "../order/OrderList";
import { RoutePath } from "../../constants/RoutePath";

const drawerWidth = 240;

export default observer(function DashboardShopScreen() {
  const { usershop, GetShopByUserId } = useStore().shopuserStore;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  useEffect(() => {
    GetShopByUserId();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [screenComponent, setScreenComponent] = useState("dashboard");

  const renderScreens = () => {
    switch (screenComponent) {
      case "CreateShop":
        return <CreateShopScreen />;
      case "ProductGIList":
        return <ProductGIList />;
      case "ProductList":
        return <ProductList />;
      case "OrderList":
        return <OrderList />;
      case "dashboard":
        return (
          <>
            <Card style={{ marginBottom: "20px" }}>
              <CardMedia
                component="img"
                height="300"
                image={imageDashboard}
                alt="Dashboard"
              />
            </Card>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={2.39}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Sales
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      1500
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={2.39}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Orders
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      230
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={2.39}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Customers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      300
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={2.39}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Customers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      300
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={2.39}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Customers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      300
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </>
        );
      default:
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List
        style={{
          cursor: "pointer",
        }}
      >
        <ListItem onClick={() => setScreenComponent("dashboard")}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="แดชบอร์ด" />
        </ListItem>
        <Collapse timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem component={Link} to={RoutePath.firstscreen}>
              <ListItemText primary="Dashboard Home" sx={{ pl: 4 }} />
            </ListItem>
          </List>
        </Collapse>
        <ListItem onClick={() => setScreenComponent("CreateShop")}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="แก้ไขร้านค้า" />
        </ListItem>
        <ListItem onClick={() => setScreenComponent("ProductGIList")}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="เพิ่มข้อมูลสินค้า (GI)" />
        </ListItem>

        <ListItem onClick={() => setScreenComponent("ProductList")}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="เพิ่มสินค้า" />
        </ListItem>
        <ListItem onClick={() => setScreenComponent("OrderList")}>
          <ListItemIcon>
            <ReceiptLongIcon />
          </ListItemIcon>
          <ListItemText primary="คำสั่งซื้อ" />
        </ListItem>
        {/* <ListItem   component={Link} to="/integrations">
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Integrations" />
        </ListItem>  */}
      </List>
      <Divider />
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#3f51b5",
        }}
      >
        <Toolbar>
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
            ร้านค้า {usershop && usershop.name}
          </Typography>
          <div>
            <NavLink
              to={RoutePath.homeScreen}
              style={{ textDecoration: "none", color: "#fff" }}
            >
              กลับหน้าหลัก
            </NavLink>
          </div>
          <div
            style={{
              marginLeft: 20,
            }}
          >
            {usershop && usershop.user.fullName}
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
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
        {renderScreens()}
      </Box>
    </Box>
  );
});
