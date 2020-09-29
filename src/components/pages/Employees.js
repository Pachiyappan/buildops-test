import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

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
      if (params.action === "edit") {
        getEmployeeById(params.id.toString());
      }
      setOpenEditDialog(true);
    }
    fetchData();
  }, [params]);

  const fetchData = async () => {
    const query = ` query{
      listEmployees{
        items{
          id 
          firstName
          lastName 
        }
      }
    }`;
    const { data } = await API.graphql(graphqlOperation(query));
    setEmplyees(data?.listEmployees?.items);
  };

  const getEmployeeById = async (id) => {
    const getQuery = `query{
      getEmployee(id: ${id}) {
        id
        lastName
        firstName
        createdAt
        updatedAt
      }
    }`;
    const { data } = await API.graphql(graphqlOperation(getQuery));
  };

  const handleClose = () => {
    setOpenEditDialog(false);
  };

  const handleDelete = (id) => {
    setDelete(id);
  };
  const onSave = () => {};
  const onDelete = async () => {
    const deleteEmployee = `mutation{
      deleteEmployee(input: {id: ${isDelete}}) {
      id
    } 
  }`;
    console.log(deleteEmployee);
    await API.graphql(graphqlOperation(deleteEmployee));
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Skills</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees &&
              employees.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {`${row?.firstName} ${row?.lastName}`}
                  </TableCell>
                  <TableCell align="center">{row?.skills}</TableCell>
                  <TableCell align="right">
                    <Edit
                      onClick={() => history.push(`/employees/${row.id}/edit`)}
                    />
                    <Delete onClick={() => handleDelete(row.id.toString)} />
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
