import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { RoutePath } from "../../constants/RoutePath";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";

export default observer(function Navbar() {
  const {
    commonStore: { token },
    userStore: { user },
  } = useStore();

  console.log("user", user);

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

        {token ? (
          <>
            <Button color="inherit">
              <NavLink
                to={RoutePath.loginScreen}
                style={{ textDecoration: "none", color: "#fff" }}
              >
                {user?.fullName}
              </NavLink>
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit">
              <NavLink
                to={RoutePath.loginScreen}
                style={{ textDecoration: "none", color: "#fff" }}
              >
                เข้าสู่ระบบ
              </NavLink>
            </Button>
            <Button color="inherit" href={RoutePath.loginScreen}>
              <NavLink
                to={RoutePath.registerScreen}
                style={{ textDecoration: "none", color: "#fff" }}
              >
                สมัครสมาชิก
              </NavLink>
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
});
