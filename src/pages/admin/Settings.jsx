import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Paper, Typography, Switch, FormControlLabel, TextField, Button, Grid
} from '@mui/material';
import { useSnackbar } from 'notistack';

async function fetchSettings() {
  const { data } = await axios.get('/api/settings'); // backend endpoint
  return data;
}

async function updateSettings(newSettings) {
  await axios.put('/api/settings', newSettings);
}

export default function Settings() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, error } = useQuery(['settings'], fetchSettings);

  const mutation = useMutation(updateSettings, {
    onSuccess: () => {
      enqueueSnackbar('Settings updated successfully', { variant: 'success' });
      queryClient.invalidateQueries(['settings']);
    },
    onError: () => {
      enqueueSnackbar('Failed to update settings', { variant: 'error' });
    },
  });

  if (isLoading) return <p>Loading settings...</p>;
  if (error) return <p>Error loading settings</p>;

  const handleToggle = (field) => {
    mutation.mutate({ ...data, [field]: !data[field] });
  };

  const handleApiKeyChange = (e) => {
    mutation.mutate({ ...data, apiKey: e.target.value });
  };

  return (
    <Paper sx={{ mt: 3, p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Settings</Typography>

      <Grid container spacing={3}>
        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Notifications</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={data.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
              />
            }
            label="Email Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={data.smsNotifications}
                onChange={() => handleToggle('smsNotifications')}
              />
            }
            label="SMS Notifications"
          />
        </Grid>

        {/* API Key */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6">API Key</Typography>
          <TextField
            fullWidth
            label="API Key"
            value={data.apiKey || ''}
            onChange={handleApiKeyChange}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => mutation.mutate(data)}
          >
            Save API Key
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
