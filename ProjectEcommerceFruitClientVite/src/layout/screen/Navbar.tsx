import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { RoutePath } from "../../constants/RoutePath";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <NavLink
            to={RoutePath.HomeScreen}
            style={{ textDecoration: "none", color: "#fff" }}
          >
            เกษตรกรไทยแท้แน่นวล
          </NavLink>
        </Typography>

        <Button color="inherit">
          <NavLink
            to={RoutePath.loginScreen}
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Login
          </NavLink>
        </Button>
        <Button color="inherit" href={RoutePath.loginScreen}>
          <NavLink
            to={RoutePath.registerScreen}
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Sign Up
          </NavLink>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
