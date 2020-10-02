import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    button: {
      background: "#009688",
      color: "#fff",
    },
  })
);

const PrimaryButton = (props) => {
  const classes = useStyles();
  const { text, onClick } = props;
  return (
    <div className={classes.root}>
      <Button  variant="contained" onClick={onClick}>
        {text}
      </Button>
    </div>
  );
};

export { PrimaryButton };
