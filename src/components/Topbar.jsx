import { AppBar, Toolbar, Typography, IconButton, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function Topbar() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <SearchIcon />
          <InputBase placeholder="Search…" sx={{ ml: 1, flex: 1 }} />
        </Box>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <Typography variant="subtitle1" sx={{ ml: 1 }}>
          Admin
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
