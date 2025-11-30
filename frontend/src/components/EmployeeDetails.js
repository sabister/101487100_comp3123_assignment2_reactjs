import React from "react";
import { Box, Typography, Button } from "@mui/material";

export default function EmployeeDetails({ employee, onClose }) {
  if (!employee) return null;
  return (
    <Box sx={{ p: 2, border: "1px solid #bccbfaff", mt: 2 }}>
      <Typography variant="h6">Employee Details</Typography>
      {employee.photo && <img src={`http://localhost:5000${employee.photo}`} alt="" style={{ width: 120, height: 120, objectFit: "cover", marginTop: 8 }} />}
      <Typography>Name: {employee.first_name} {employee.last_name}</Typography>
      <Typography>Email: {employee.email}</Typography>
      <Typography>Position: {employee.position}</Typography>
      <Typography>Department: {employee.department}</Typography>
      <Typography>Salary: {employee.salary}</Typography>
      <Typography>Date Joined: {new Date(employee.date_of_joining).toLocaleDateString()}</Typography>
      <Button onClick={onClose} sx={{ mt: 1 }}>Close</Button>
    </Box>
  );
}
