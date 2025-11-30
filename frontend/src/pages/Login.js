import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Container, TextField, Button, Box, Typography } from "@mui/material";

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await api.post("/auth/login", { emailOrUsername, password });
      localStorage.setItem("token", res.data.token);
      navigate("/employees");
    } catch (error) {
      setErr(error.response?.data?.message || "login failed");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <Box component="form" onSubmit={submit} sx={{ display: "grid", gap: 2 }}>
        <TextField label="Email or Username" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <Typography color="error">{err}</Typography>}
        <Button type="submit" variant="contained">Login</Button>
      </Box>
    </Container>
  );
}
