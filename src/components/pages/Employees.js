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
import { EditEmployee } from "./EditEmployees";
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

export const GET_EMPLOYEES = gql`
  query {
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
  }
`;
const ADD_EMPLOYEE = gql`
  mutation create(
    $employeeSkillsId: ID
    $firstName: String!
    $lastName: String!
  ) {
    createEmployee(
      input: {
        employeeSkillsId: $employeeSkillsId
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      firstName
      id
      lastName
      updatedAt
      createdAt
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation update(
    $id: ID!
    $employeeSkillsId: ID
    $firstName: String!
    $lastName: String!
  ) {
    updateEmployee(
      input: {
        id: $id
        employeeSkillsId: $employeeSkillsId
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      firstName
      id
      lastName
      updatedAt
      createdAt
    }
  }
`;

const Employees = (props) => {
  const classes = useStyles();
  const { data, refetch } = useQuery(GET_EMPLOYEES);
  const [addEmployee] = useMutation(ADD_EMPLOYEE);
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);
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
    history.push(`/employees`);
  };

  const handleDelete = (id) => {
    setDelete(id);
  };
  const saveEmployee = async (data) => {
    if (params.action === "edit") {
      updateEmployee({
        variables: {
          id: params.id,
          firstName: data?.firstName,
          lastName: data?.lastName,
          employeeSkillsId: data?.employeeSkillsId,
        },
      });
    } else {
      addEmployee({
        variables: {
          firstName: data?.firstName,
          lastName: data?.lastName,
          employeeSkillsId: data?.employeeSkillsId,
        },
      });
    }
    refetch();
    handleClose();
  };
  const onDelete = async () => {
    const deleteEmployee = `mutation{
      deleteEmployee(input: {id: "${isDelete}"}) {
      id
    } 
  }`;
    await API.graphql(graphqlOperation(deleteEmployee)).then((res) => {
      setDelete(null);
    });
    refetch();
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
      <TableContainer className={classes.tableCont} component={Paper}>
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
          {data?.listEmployees?.items.length ? (
            <TableBody>
              {data?.listEmployees?.items.map((row) => (
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
          ) : (
            <EmptyMessage message="No data found" />
          )}
        </Table>
      </TableContainer>
      {isOpenEditDialog && (
        <EditEmployee
          isOpen={isOpenEditDialog}
          handleClose={handleClose}
          onSave={saveEmployee}
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
