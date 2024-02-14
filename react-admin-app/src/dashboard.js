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
} from "@mui/material";

const UsersApi = `${process.env.REACT_APP_API_URL}/api/v1/users`;
console.log("**************");
console.log(UsersApi);
console.log("**************");

const Dashboard = () => {
  const [phoneNumber, setphoneNumber] = useState("");
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newphoneNumber, setNewphoneNumber] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(UsersApi);
      console.log(response.data);
      setData(response.data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${UsersApi}/signup`, { phoneNumber: newphoneNumber });
      setModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  return (
    <div class="App">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Mobile Number</TableCell>
              {/* Add more table headers if needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={item._id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.phoneNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" onClick={() => setModalOpen(true)}>
        Add Mobile Number
      </Button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 20,
          }}
        >
          <TextField
            label="Mobile Number"
            value={newphoneNumber}
            onChange={(e) => setNewphoneNumber(e.target.value)}
          />
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
