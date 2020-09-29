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
import { EditEmployee } from "./EditEmployees";
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

const Employees = (props) => {
  const classes = useStyles();
  const [isOpenEditDialog, setOpenEditDialog] = useState(false);
  const [isDelete, setDelete] = useState(null);
  const [employees, setEmplyees] = useState([]);
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
      listEmployees {
        items {
          createdAt
          firstName
          id
          lastName
          updatedAt
          skills {
            id
            name
            updatedAt
            createdAt
          }
        }
      }
    }`;
    const { data } = await API.graphql(graphqlOperation(query));
    setEmplyees(data?.listEmployees?.items);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
    history.push(`/employees`);
  };

  const handleDelete = (id) => {
    setDelete(id);
  };
  const onSave = () => {};
  const onDelete = async () => {
    const deleteEmployee = `mutation{
      deleteEmployee(input: {id: "${isDelete}"}) {
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
          Employees
        </Typography>
        <PrimaryButton
          text="Add New"
          onClick={() => history.push(`/employees/new`)}
        />
      </Toolbar>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.headerCell}>Name</TableCell>
              <TableCell className={classes.headerCell} align="center">
                Skills
              </TableCell>
              <TableCell className={classes.headerCell} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees &&
              employees.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {`${row?.firstName} ${row?.lastName}`}
                  </TableCell>
                  <TableCell align="center">{row?.skills?.name}</TableCell>
                  <TableCell align="right">
                    <Edit
                      onClick={() => history.push(`/employees/${row.id}/edit`)}
                    />
                    <Delete onClick={() => handleDelete(row.id)} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isOpenEditDialog && (
        <EditEmployee
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
export { Employees };
