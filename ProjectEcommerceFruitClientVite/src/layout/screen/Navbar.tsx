import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
} from "@mui/material";
import { RoutePath } from "../../constants/RoutePath";
import { NavLink, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ButtonMui from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

export default observer(function Navbar() {
  const navigate = useNavigate();
  const { user, getUserDetailbyId} = useStore().userStore;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getUserDetailbyId();
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <NavLink
            to={RoutePath.homeScreen}
            style={{ textDecoration: "none", color: "#fff" }}
          >
            เกษตรกรไทยแท้แน่นวล
          </NavLink>
        </Typography>

        {user ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <ButtonMui color="inherit" onClick={handleClick}>
              <Typography variant="body1" color="inherit">
                {user.fullName}
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
              <MenuItem onClick={handleClose}>ข้อมูลส่วนตัว</MenuItem>

              {user.stores.length ? (
                <MenuItem onClick={handleClose}>
                  <NavLink
                    to={RoutePath.dashboardShopScreen}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    ร้านค้า
                  </NavLink>
                </MenuItem>
              ) : (
                <MenuItem onClick={handleClose}>
                  <NavLink
                    to={RoutePath.createShopScreen}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    ลงทะเบียนเพื่อขาย
                  </NavLink>
                </MenuItem>
              )}

              <Divider />
            </Menu>
            <IconButton color="inherit" aria-label="cart">
              <Badge badgeContent={4} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </div>
        ) : (
          <div>
            <Button color="inherit">
              <NavLink
                to={RoutePath.loginScreen}
                style={{ textDecoration: "none", color: "#fff" }}
              >
                Login
              </NavLink>
            </Button>
            <Button color="inherit">
              <NavLink
                to={RoutePath.registerScreen}
                style={{ textDecoration: "none", color: "#fff" }}
              >
                Sign Up
              </NavLink>
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
});