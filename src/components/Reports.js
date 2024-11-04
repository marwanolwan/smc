import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['January', 'February', 'March'],
  datasets: [{
    label: 'Engagement',
    data: [12, 19, 3],
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 1
  }]
};

return <Bar data={data} />;
