import React, { useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  Toolbar,
  Typography,
  AppBar,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      backgroundColor: "#0199ad",
      height: "80px",
    },
    toolBar: {
      height: "80px",
    },
    link: {
      textDecoration: "none",
      color: "#d4d0d0",
      height: "80px",
      alignItems: "center",
      display: "flex",
    },
    menuButton: {
      marginRight: theme.spacing(2),
      cursor: "pointer",
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    activeMenu: {
      color: "#fff",
      background: "#00bcd4",
    },
  })
);
const menuConfig = [
  {
    id: "employees",
    name: "Employees",
    path: "/employees",
    selectedMenu: ["/employees"],
  },
  {
    id: "skills",
    name: "Skills",
    path: "/skills",
    selectedMenu: ["/skills"],
  },
];
const NavBar = ({ location, ...rest }) => {
  const classes = useStyles();
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActiveMenu = (paths) => {
    return paths.some(
      (path) => location.pathname && location.pathname.indexOf(path) === 0
    );
  };
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          {menuConfig.map((menu) => (
            <Link
              key={menu.id}
              to={menu.path}
              className={`${classes.link} ${
                isActiveMenu(menu?.selectedMenu) ? classes.activeMenu : ""
              }`}
            >
              <Typography
                className={classes.menuButton}
                variant="h6"
                color="inherit"
              >
                {menu.name}
              </Typography>
            </Link>
          ))}
          <div className="flex-wrap"></div>
          {auth && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Settings</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export { NavBar };
