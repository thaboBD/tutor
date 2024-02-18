import React, { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  container: {
    maxWidth: 400,
    padding: theme.spacing(4),
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
  },
  inputField: {
    marginBottom: theme.spacing(2),
  },
  loginButton: {
    marginBottom: theme.spacing(2),
  },
  errorMessage: {
    color: theme.palette.error.main,
    marginBottom: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/login", { username, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
    } catch (error) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="sm" className={classes.container}>
        <Paper elevation={3} className={classes.paper}>
          {isLoggedIn ? (
            <div className={classes.dashboardContainer}>
              <Dashboard />
              <Button
                variant="contained"
                color="secondary"
                className={classes.logoutButton}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className={classes.loginForm}>
              <Typography variant="h5" gutterBottom>
                Login
              </Typography>
              <TextField
                className={classes.inputField}
                variant="outlined"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                className={classes.inputField}
                variant="outlined"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className={classes.loginButton}
                variant="contained"
                color="primary"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Login"}
              </Button>
              {error && <Typography className={classes.errorMessage}>{error}</Typography>}
            </div>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default App;
