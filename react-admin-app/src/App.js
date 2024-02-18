import React, { useState } from "react";
import axios from "axios";
import Dashboard from "./dashboard";
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";

const LoginApi = `${process.env.REACT_APP_API_URL}/api/v1/users/login`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(LoginApi, { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
    } catch (error) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper sx={{ padding: "20px", width: 400 }}>
        {isLoggedIn ? (
          <div>
            <Dashboard />
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Login
            </Typography>
            <TextField
              variant="outlined"
              label="Email"
              fullWidth
              sx={{ mb: 2 }}
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <TextField
              variant="outlined"
              type="password"
              label="Password"
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
          </div>
        )}
      </Paper>
    </Container>
  );
}

export default App;
