import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ActionBarChart = ({ data = {} }) => {
  const labels = Object.keys(data).length > 0 ? Object.keys(data) : ['Retry Payment', 'Offer Coupon', 'Free Shipping', 'Reminder Email', 'WhatsApp', 'Do Nothing'];
  const values = Object.keys(data).length > 0 ? Object.values(data) : [42, 28, 18, 15, 22, 30];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Recommended Interventions',
        data: values,
        backgroundColor: '#0284c7',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
        grid: { display: false }
      },
      y: {
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
        grid: { color: '#334155' }
      }
    }
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ActionBarChart;
