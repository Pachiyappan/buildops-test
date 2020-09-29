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

const EditEmployee = ({ isOpen, handleClose, onSave }) => {
  const [skills, setSkills] = useState([]);
  const [skillSets, setSkillSets] = useState([]);
  useEffect(() => {
    fetchData();
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
  const handleChange = (id) => {
    const selectedId = skillSets && skillSets.filter((a) => a === id);
    if (selectedId) {
      const removeIds = skillSets && skillSets.filter((a) => a !== selectedId);
      setSkillSets(removeIds);
    } else {
      setSkillSets([...skillSets, id]);
    }
  };
  const isChecked = (id) => {
    if (includes(skillSets, id)) return true;
    else return false;
  };
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create new employee</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="First Name"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
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
          <Button onClick={onSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { EditEmployee };
