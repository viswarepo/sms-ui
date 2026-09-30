// src/pages/UserProfile.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, Button
} from "@mui/material";

import { Link } from "react-router-dom";

async function fetchUserProfile() {
  const { data } = await api.get("/api/v1/users/all"); 
  console.log("User Profile API response:", data);
  return data;
}

export default function UserProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  if (isLoading) return <CircularProgress sx={{ m: 3 }} />;
  if (error) return <p>Error loading profile</p>;

  const users = Array.isArray(data) ? data : data?.userProfile || [];

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Typography variant="h5" sx={{ p: 2 }}>User Profiles</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Organization ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.organizationId}</TableCell>
                <TableCell>
                  
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ mr: 1 }}
                    onClick={() =>
                      console.log("Edit feature coming soon!", user.id)
                    }
                  >
                    Edit
                  </Button>
                
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
                      sx={{ m: 2 }}
                      variant="contained"
                      color="success"
                      component={Link}
                      to="/admindashboard/userProfile/add"
                    >
                      Add New User
                    </Button>
      </TableContainer>

      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <>
              <Typography><strong>ID:</strong> {selectedUser.id}</Typography>
              <Typography><strong>Username:</strong> {selectedUser.username}</Typography>
              <Typography><strong>Name:</strong> {selectedUser.fullName}</Typography>
              <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
              <Typography><strong>Organization ID:</strong> {selectedUser.organizationId}</Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
