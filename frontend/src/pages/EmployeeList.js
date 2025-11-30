import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmployees, deleteEmployee, searchEmployees } from "../api/employees";
import {
  Container, Table, TableHead, TableBody, TableRow, TableCell,
  Button, Box, TextField, Typography
} from "@mui/material";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeDetails from "../components/EmployeeDetails";

export default function EmployeeList() {
  const queryClient = useQueryClient();
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterPos, setFilterPos] = useState("");

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await getEmployees();
      return res.data;
    }
  });

  const deleteMut = useMutation({
    mutationFn: async (id) => {
      const res = await deleteEmployee(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    }
  });

  const doSearch = async () => {
    try {
      const params = {
        q: search || undefined,
        department: filterDept || undefined,
        position: filterPos || undefined
      };

      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key]
      );

      const res = await searchEmployees(params);

      queryClient.setQueryData(["employees"], res.data);
    } catch (err) {
      console.error("SEARCH ERROR:", err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Email/name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TextField
          label="Department"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        />
        <TextField
          label="Position"
          value={filterPos}
          onChange={(e) => setFilterPos(e.target.value)}
        />

        <Button variant="contained" onClick={doSearch}>Search</Button>

        <Button
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            setSearch("");
            setFilterDept("");
            setFilterPos("");
          }}
        >
          Reset
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="contained" onClick={() => { setEditing(null); setOpenForm(true); }}>
          Add Employee
        </Button>
      </Box>

      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Date Joined</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees.map(emp => (
              <TableRow key={emp._id}>
                <TableCell>
                  {emp.photo ? (
                    <img
                      src={`http://localhost:5000${emp.photo}`}
                      alt=""
                      style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                    />
                  ) : "—"}
                </TableCell>

                <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.position}</TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell>{emp.salary}</TableCell>
                <TableCell>{new Date(emp.date_of_joining).toLocaleDateString()}</TableCell>

                <TableCell>
                  <Button size="small" onClick={() => setSelected(emp)}>View</Button>
                  <Button size="small" onClick={() => { setEditing(emp); setOpenForm(true); }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => deleteMut.mutate(emp._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <EmployeeForm
        open={openForm}
        onClose={() => { setOpenForm(false); queryClient.invalidateQueries({ queryKey: ["employees"] }); }}
        editing={editing}
      />

      {selected && (
        <EmployeeDetails employee={selected} onClose={() => setSelected(null)} />
      )}
    </Container>
  );
}
