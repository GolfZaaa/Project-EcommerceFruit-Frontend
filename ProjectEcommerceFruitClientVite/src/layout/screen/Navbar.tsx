import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from "@mui/material";
import { RoutePath } from "../../constants/RoutePath";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
export default observer(function Navbar() {

  const {user, getUserDetailbyId}  = useStore().userStore;

  useEffect(() => {
    getUserDetailbyId()
  }, [])
  
  console.log("user1",user);
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

        {user.user ? 
        <div style={{display:'flex',alignItems:'center'}}>
        
        <Typography variant="body1" color="inherit" sx={{ marginRight:3 }}>
          {user.user}
        </Typography>
        <IconButton color="inherit" aria-label="cart">
          <Badge badgeContent={4} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </div>
        :
        <div>
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
        </div>
        }
        
      </Toolbar>
    </AppBar>
  );
});
