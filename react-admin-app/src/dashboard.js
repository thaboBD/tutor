import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";

const UsersApi = `${process.env.REACT_APP_API_URL}/api/v1/users`;
const authToken = localStorage.getItem("token");

const Dashboard = ({setIsLoggedIn}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("USERS API", UsersApi)
      console.log("AUTH TOKEN", authToken)
      const response = await axios.get(UsersApi, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "ngrok-skip-browser-warning": "69420"
        }
      });
      console.log(response)
      // if (!response.data.users) throw Error;
      let users = response.data.users || [];
      console.log("RESPONSE USERS", users)
      setData(users);
    } catch (error) {
      console.error("Error fetching data:", error);
      // localStorage.removeItem("token");
      setNotification({ type: "error", message: "Failed to fetch data" });
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${UsersApi}/signup`,
        { phoneNumber: newPhoneNumber },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setModalOpen(false);
      fetchData();
      setNotification({ type: "success", message: "Phone number added successfully" });
    } catch (error) {
      console.error("Error creating data:", error);
      setNotification({ type: "error", message: "Failed to add phone number" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`${UsersApi}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          data: { id },
        });
        fetchData();
        setNotification({ type: "success", message: "Record deleted successfully" });
      } catch (error) {
        console.error("Error deleting data:", error);
        setNotification({ type: "error", message: "Failed to delete record" });
      }
    }
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="dashboard-container" style={{ padding: "20px" }}>
      <Button
        variant="contained"
        color="secondary"
        style={{ position: "absolute", top: 20, right: 20 }}
        onClick={handleLogout}
      >
        Logout
      </Button>

      <Typography variant="h4" align="center" gutterBottom>
        Thabo Chatbot Admin Panel
      </Typography>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      <form onSubmit={handleCreate}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 20,
            borderRadius: 8,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add Mobile Number
          </Typography>
          <TextField
            label="Mobile Number"
            value={newPhoneNumber}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleCreate} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
        </div>
        </form>
      </Modal>

      <div className="table-container" style={{ margin: "auto", maxWidth: "80%" }}>
        <Button
          variant="contained"
          onClick={() => setModalOpen(true)}
          style={{ marginBottom: 20 }}
        >
          Add Mobile Number
        </Button>
        <TableContainer component={Paper} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Mobile Number</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, idx) => (
                <TableRow key={item.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{item.phoneNumber}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </div>

      <Snackbar open={!!notification} autoHideDuration={6000} onClose={handleNotificationClose}>
        <Alert
          onClose={handleNotificationClose}
          severity={notification ? notification.type : "success"}
          sx={{ width: "100%" }}
        >
          {notification && notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
