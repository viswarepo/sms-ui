// src/components/RevenueChart.jsx
import { LineChart } from '@mui/x-charts';
import { Paper } from '@mui/material';

export default function RevenueChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const revenue = [2000, 2500, 3000, 2800, 3500, 4000]; // ✅ all numbers

  return (
    <Paper style={{ padding: '1rem' }}>
      <LineChart
        xAxis={[{ data: months }]}
        series={[{ data: revenue, label: 'Revenue ($)' }]}
        width={500}
        height={300}
      />
    </Paper>
  );
}
