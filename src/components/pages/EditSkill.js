import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const EditSkill = (props) => {
  const [skillName, setSkillName] = useState("");
  const {
    isOpen,
    onSave,
    handleClose,
    match: { params },
  } = props;
  useEffect(() => {
    if (params.id) {
      if (params.action === "edit") {
        getSkillById(params.id);
      }
    }
  }, []);

  const getSkillById = async (id) => {
    const getQuery = `query{
        getSkill(id: "${id}") {
            id
            name
        }
    }`;
    const { data } = await API.graphql(graphqlOperation(getQuery));
    setSkillName(data?.getSkill?.name);
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {params.action === "edit" ? "Update" : "Create new"} skill
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            value={skillName}
            margin="dense"
            id="name"
            label="Skill Name"
            onChange={(e) => setSkillName(e.target.value)}
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => onSave(skillName)}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { EditSkill };
