import React, { useState, useEffect } from "react";
import { createEmployee, updateEmployee } from "../api/employees";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function EmployeeForm({ open, onClose, editing }) {
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", position: "",
    salary: "", date_of_joining: "", department: ""
  });

  const [photoFile, setPhotoFile] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editing) {
      setForm({
        first_name: editing.first_name || "",
        last_name: editing.last_name || "",
        email: editing.email || "",
        position: editing.position || "",
        salary: editing.salary || "",
        date_of_joining: editing.date_of_joining
          ? new Date(editing.date_of_joining).toISOString().slice(0, 10)
          : "",
        department: editing.department || ""
      });
      setPhotoFile(null);
    } else {
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        position: "",
        salary: "",
        date_of_joining: "",
        department: ""
      });
      setPhotoFile(null);
    }
  }, [editing, open]);


  const createMut = useMutation({
    mutationFn: (fd) => createEmployee(fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    }
  });

  const updateMut = useMutation({
    mutationFn: ({ id, fd }) => updateEmployee(id, fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));
    if (photoFile) fd.append("photo", photoFile);

    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing._id, fd });
      } else {
        await createMut.mutateAsync(fd);
      }
      onClose();
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  if (!open) return null;

  return (
    <Box sx={{ p: 3, border: "1px solid #ccd0faff", mt: 2 }}>
      <Typography variant="h6">
        {editing ? "Edit Employee" : "Add Employee"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "grid", gap: 2, mt: 2 }}
      >
        <TextField
          label="First name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
        />

        <TextField
          label="Last name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          required
        />

        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <TextField
          label="Position"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          required
        />

        <TextField
          label="Department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          required
        />

        <TextField
          label="Salary"
          type="number"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
          required
        />

        <TextField
          label="Date of Joining"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.date_of_joining}
          onChange={(e) =>
            setForm({ ...form, date_of_joining: e.target.value })
          }
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files[0])}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button type="submit" variant="contained">
            {editing ? "Update" : "Add"}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Box>
      </Box>
    </Box>
  );
}
