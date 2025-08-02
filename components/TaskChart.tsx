// components/TaskChart.tsx
'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ChartData = {
  name: string;
  tasks: number;
  fill: string;
}[];

interface TaskChartProps {
  data: ChartData;
}

export const TaskChart = ({ data }: TaskChartProps) => {
  // Don't render the chart if there are no tasks
  if (data.every(item => item.tasks === 0)) {
    return null;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="tasks"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};