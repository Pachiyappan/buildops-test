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
  })
);

const PrimaryButton = (props) => {
  const classes = useStyles();
  const { text, onClick } = props;
  return (
    <div className={classes.root}>
      <Button variant="contained" color="primary" onClick={onClick}>
        {text}
      </Button>
    </div>
  );
};

export { PrimaryButton };
