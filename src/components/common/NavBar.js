import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    link: {
      textDecoration: "none",
      color: "#d4d0d0",
    },
    menuButton: {
      marginRight: theme.spacing(2),
      cursor: "pointer",
    },
    activeMenu: {
      color: "#fff",
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
  const isActiveMenu = (paths) => {
    return paths.some(
      (path) => location.pathname && location.pathname.indexOf(path) === 0
    );
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
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
                variant="h5"
                color="inherit"
              >
                {menu.name}
              </Typography>
            </Link>
          ))}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export { NavBar };
