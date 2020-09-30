import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography, FormControlLabel, Checkbox } from "@material-ui/core";
import { includes } from "lodash";

const EditEmployee = (props) => {
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
      setSkillSets(removeIds);
    } else {
      setSkillSets([...skillSets, id]);
    }
  };
  const isChecked = (id) => {
    if (includes(skillSets, id)) return true;
    else return false;
  };

  const handleFormData = (key, value) => {
    setFormValue({ ...formValue, [key]: value });
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
            autoFocus
            value={formValue?.firstName}
            margin="dense"
            id="name"
            label="First Name"
            onChange={(e) => handleFormData("firstName", e.target.value)}
            type="text"
            fullWidth
          />
          <TextField
            value={formValue?.lastName}
            margin="dense"
            onChange={(e) => handleFormData("lastName", e.target.value)}
            id="name"
            label="Last Name"
            type="text"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>

          <Button
            type="submit"
            onClick={() => onSave(formValue)}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { EditEmployee };
