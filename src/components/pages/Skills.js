import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Delete, Edit } from "@material-ui/icons";
import { EditSkill } from "./EditSkill";
import { DialogModal } from "../common";
import { Typography, Toolbar } from "@material-ui/core";
import { PrimaryButton } from "../common";

const useStyles = makeStyles((theme) =>
  createStyles({
    table: {
      minWidth: 650,
    },
    tableHeader: {
      background: "#3f51b52e",
    },
    headerCell: {
      fontSize: "20px",
      fontWeight: 600,
    },
    header: {
      flexGrow: 1,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  })
);

const Skills = (props) => {
  const classes = useStyles();
  const [isOpenEditDialog, setOpenEditDialog] = useState(false);
  const [isDelete, setDelete] = useState(null);
  const [skills, setSkills] = useState([]);
  const {
    history,
    match: { params },
  } = props;

  useEffect(() => {
    if (params.id) {
      setOpenEditDialog(true);
    }
    fetchData();
  }, [params]);

  const fetchData = async () => {
    const query = ` query{
        listSkills {
            items {
                id
                name
            }
        }
    }`;
    const { data } = await API.graphql(graphqlOperation(query));
    setSkills(data?.listSkills?.items);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
    history.push(`/skills`);
  };

  const handleDelete = (id) => {
    setDelete(id);
  };
  const onSave = () => {};
  const onDelete = async () => {
    const deleteEmployee = `mutation{
      deleteSkill(input: {id: "${isDelete}"}) {
      id
    } 
  }`;
    await API.graphql(graphqlOperation(deleteEmployee)).then((res) => {
      setDelete(null);
      fetchData();
    });
  };

  return (
    <div>
      <Toolbar>
        <Typography className={classes.header} variant="h5" color="inherit">
          Skills
        </Typography>
        <PrimaryButton
          text="Add New"
          onClick={() => history.push(`/skills/new`)}
        />
      </Toolbar>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.headerCell}>Skill Name</TableCell>
              <TableCell className={classes.headerCell} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skills &&
              skills.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row?.name}
                  </TableCell>
                  <TableCell align="right">
                    <Edit
                      onClick={() => history.push(`/skills/${row.id}/edit`)}
                    />
                    <Delete onClick={() => handleDelete(row.id)} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isOpenEditDialog && (
        <EditSkill
          isOpen={isOpenEditDialog}
          handleClose={handleClose}
          onSave={onSave}
          {...props}
        />
      )}
      {isDelete && (
        <DialogModal
          isOpen={!!isDelete}
          handleCancel={() => handleDelete(null)}
          onConfirm={onDelete}
        />
      )}
    </div>
  );
};
export { Skills };
