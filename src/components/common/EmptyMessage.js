import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    message: {
      textAlign: "right",
      margin: "2rem 0",
      fontSize: "20px",
    },
  })
);

const EmptyMessage = ({ message }) => {
  const classes = useStyles();
  return <div className={classes.message}>{message}</div>;
};

export { EmptyMessage };
