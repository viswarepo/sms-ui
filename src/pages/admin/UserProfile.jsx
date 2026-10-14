// src/pages/UserProfile.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";   // ✅ import useNavigate
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, Button, DialogActions
} from "@mui/material";
import { useSnackbar } from "notistack";

async function fetchUserProfile() {
  const userRole = localStorage.getItem("role"); 
  const { data } = await api.get("/api/v1/users/all/"+userRole); 
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

  const navigate = useNavigate();              // ✅ define navigate here
  const { enqueueSnackbar } = useSnackbar();   // ✅ define snackbar here

  const handleOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    const userRole = localStorage.getItem("role"); // or from auth context
    if (userRole === "ROLE_ADMIN") {
      navigate("/admindashboard/userProfile/add");
    } else if (userRole === "ROLE_OWNER") {
      navigate("/ownerdashboard/owner-userProfile/add");
    } else if (userRole === "ROLE_ADMIN_SUPER") {
      navigate("/superadmin-dashboard/superadmin-userProfile/add");
    }else {
      enqueueSnackbar("Unauthorized role", { variant: "error" });
    }
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
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpen(user)}
                  >
                    View
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
          onClick={handleAddUser}
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
        <DialogActions>
                  <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
      </Dialog>
    </>
  );
}
