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

const UsersApi = `${process.env.REACT_APP_API_URL}/api/v1/users/login`;
const authToken = localStorage.getItem("token");

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!authToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(UsersApi, { email, password });
      const { token } = response.data;
      console.log("TOKEN: ", token);
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
    } catch (error) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <Dashboard setIsLoggedIn={setIsLoggedIn}/>
        </div>
      ) : (
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Paper sx={{ padding: "20px", width: 400 }}>
            <form onSubmit={handleLogin}>
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="submit"
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
            </form>
          </Paper>
        </Container>
      )}
    </div>
  );
}

export default App;
