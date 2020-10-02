import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
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
import { PrimaryButton, EmptyMessage } from "../common";

const useStyles = makeStyles((theme) =>
  createStyles({
    tableCont: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      width: "auto",
    },
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

export const GET_SKILLS = gql`
  query MyQuery {
    listSkills {
      items {
        id
        name
      }
    }
  }
`;
const ADD_SKILL = gql`
  mutation create($name: String!) {
    createSkill(input: { name: $name }) {
      id
      name
    }
  }
`;
const UPDATE_SKILL = gql`
  mutation create($id: ID!, $name: String!) {
    updateSkill(input: { id: $id, name: $name }) {
      id
      name
    }
  }
`;
const Skills = (props) => {
  const classes = useStyles();
  const { data, refetch } = useQuery(GET_SKILLS);
  const [addSkill] = useMutation(ADD_SKILL);
  const [updateSkill] = useMutation(UPDATE_SKILL);
  const [isOpenEditDialog, setOpenEditDialog] = useState(false);
  const [isDelete, setDelete] = useState(null);
  const {
    history,
    match: { params },
  } = props;

  useEffect(() => {
    if (params.id) {
      setOpenEditDialog(true);
    }
  }, [params]);

  const handleClose = () => {
    setOpenEditDialog(false);
    history.push(`/skills`);
  };

  const handleDelete = (id) => {
    setDelete(id);
  };

  const saveSkill = async (skillName) => {
    if (params.action === "edit") {
      updateSkill({ variables: { id: params.id, name: skillName } });
    } else {
      addSkill({ variables: { name: skillName } });
    }
    refetch();
    handleClose();
  };
  const onDelete = async () => {
    const deleteEmployee = `mutation{
      deleteSkill(input: {id: "${isDelete}"}) {
      id
    } 
  }`;
    await API.graphql(graphqlOperation(deleteEmployee)).then((res) => {
      setDelete(null);
      refetch();
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
      <TableContainer className={classes.tableCont} component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.headerCell}>Skill Name</TableCell>
              <TableCell className={classes.headerCell} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          {data?.listSkills?.items.length ? (
            <TableBody>
              {data?.listSkills?.items.map((row) => (
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
          ) : (
            <EmptyMessage message="No data found" />
          )}
        </Table>
      </TableContainer>
      {isOpenEditDialog && (
        <EditSkill
          isOpen={isOpenEditDialog}
          handleClose={handleClose}
          onSave={saveSkill}
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
