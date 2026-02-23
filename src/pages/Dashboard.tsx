import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { cn } from '../lib/utils';

const data = [
  { name: 'Mon', appointments: 4 },
  { name: 'Tue', appointments: 3 },
  { name: 'Wed', appointments: 2 },
  { name: 'Thu', appointments: 5 },
  { name: 'Fri', appointments: 6 },
  { name: 'Sat', appointments: 8 },
  { name: 'Sun', appointments: 7 },
];

const StatCard = ({
  icon: Icon,
  title,
  value,
  trend,
  color,
}: {
  icon: any;
  title: string;
  value: string;
  trend: string;
  color: string;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <div className="flex items-center mt-2 text-sm text-green-600 font-medium">
        <TrendingUp className="h-4 w-4 mr-1" />
        <span>{trend}</span>
      </div>
    </div>
    <div className={cn("p-3 rounded-full bg-opacity-10", color)}>
      <Icon className={cn("h-6 w-6", color.replace('bg-', 'text-'))} />
    </div>
  </div>
);

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, Admin! Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Calendar}
          title="Total Appointments"
          value="1,240"
          trend="+12% from last month"
          color="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          icon={Users}
          title="Active Clients"
          value="350"
          trend="+5% from last month"
          color="bg-green-100 text-green-600"
        />
        <StatCard
          icon={DollarSign}
          title="Revenue"
          value="$12,450"
          trend="+8% from last month"
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Satisfaction"
          value="4.9/5"
          trend="+2% from last month"
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Appointments Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  itemStyle={{ color: '#111827' }}
                  cursor={{ fill: '#f3f4f6' }}
                />
                <Bar
                  dataKey="appointments"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    New appointment scheduled
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
