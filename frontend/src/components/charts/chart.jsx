import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'January', expenses: 400, income: 240 },
  { name: 'February', expenses: 300, income: 220 },
  { name: 'March', expenses: 280, income: 200 },
  { name: 'April', expenses: 350, income: 250 },
  { name: 'May', expenses: 500, income: 300 },
];

class MonthlyExpensesChart extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="expenses" fill="#8884d8" />
          <Bar dataKey="income" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default MonthlyExpensesChart;
