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
        label: 'Dispatched Interventions',
        data: values,
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2563EB',
        hoverBackgroundColor: '#2563EB'
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 16
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#F8FAFC',
        bodyColor: '#94A3B8',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 12, weight: '500' } },
        grid: { display: false }
      },
      y: {
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 12, weight: '500' } },
        grid: { color: '#334155', strokeDasharray: [4, 4] }
      }
    }
  };

  return (
    <div className="h-72 p-2">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ActionBarChart;
