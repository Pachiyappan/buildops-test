import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { API, graphqlOperation } from "aws-amplify";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography, FormControlLabel, Checkbox } from "@material-ui/core";
import { includes, isEmpty } from "lodash";

const useStyles = makeStyles((theme) =>
  createStyles({
    errorText: {
      fontSize: "14px",
      color: "#f44336",
    },
  })
);

const EditEmployee = (props) => {
  const classes = useStyles();
  const [isError, setIsError] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillSets, setSkillSets] = useState([]);
  const [formValue, setFormValue] = useState({
    firstName: "",
    lastName: "",
    skills: {
      id: "",
      name: "",
    },
  });
  const {
    isOpen,
    handleClose,
    onSave,
    match: { params },
  } = props;
  useEffect(() => {
    fetchData();
    if (params.id) {
      if (params.action === "edit") {
        getEmployeeById(params.id);
      }
    }
  }, []);
  const fetchData = async () => {
    const query = ` query{
      listSkills{
        items{
          createdAt
          id
          name
          updatedAt
        }
      }
    }`;
    const { data } = await API.graphql(graphqlOperation(query));
    setSkills(data?.listSkills?.items);
  };

  const getEmployeeById = async (id) => {
    const getQuery = `query{
      getEmployee(id: "${id}") {
        createdAt
        firstName
        id
        lastName
        updatedAt
        skills {
          id
          name
        }
      }
    }`;
    const { data } = await API.graphql(graphqlOperation(getQuery));
    setFormValue(data?.getEmployee);
    setSkillSets([...skillSets, data?.getEmployee?.skills?.id]);
  };

  const handleChange = (id) => {
    const selectedId = skillSets && skillSets.filter((a) => a === id);
    if (selectedId.length) {
      const removeIds = skillSets && skillSets.filter((a) => a !== id);
      setSkillSets(removeIds.filter(Boolean));
    } else {
      setSkillSets([...skillSets, id].filter(Boolean));
    }
  };
  const isChecked = (id) => {
    if (includes(skillSets, id)) return true;
    else return false;
  };

  const handleFormData = (key, value) => {
    setFormValue({ ...formValue, [key]: value });
  };

  const onSubmit = () => {
    if (isEmpty(formValue.firstName)) {
      setIsError(true);
    } else if (isEmpty(formValue.lastName)) {
      setIsError(true);
    } else if (!skillSets.length) {
      setIsError(true);
    } else {
      onSave({
        ...formValue,
        employeeSkillsId: skillSets.length ? skillSets[0] : "",
      });
    }
  };
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {params.action === "edit" ? "Update" : "Create new"} employee
        </DialogTitle>
        <DialogContent>
          <TextField
            error={isError && !formValue?.firstName}
            autoFocus
            value={formValue?.firstName}
            margin="dense"
            id="name"
            label="First Name"
            onChange={(e) => handleFormData("firstName", e.target.value)}
            helperText="Please enter firstname"
            type="text"
            fullWidth
          />
          <TextField
            error={isError && !formValue?.lastName}
            value={formValue?.lastName}
            margin="dense"
            onChange={(e) => handleFormData("lastName", e.target.value)}
            id="name"
            label="Last Name"
            type="text"
            helperText="Please enter lastname"
            fullWidth
          />
          <Typography style={{ paddingTop: "1rem" }}>Skills</Typography>
          {skills &&
            skills.map((item) => {
              return (
                <FormControlLabel
                  key={item?.id}
                  control={
                    <Checkbox
                      checked={isChecked(item?.id)}
                      onChange={(e) => handleChange(e.target.value)}
                      name="checkedB"
                      color="primary"
                      value={item?.id}
                    />
                  }
                  label={item?.name}
                />
              );
            })}
          {isError && skillSets.length < 1 && (
            <div className={classes.errorText}>
              Please select atleast one skill.
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>

          <Button type="submit" onClick={onSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { EditEmployee };
