import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Plus,
  Search,
  XCircle,
} from 'lucide-react';

// Mock data
const initialAppointments = [
  {
    id: 1,
    client: 'Alice Johnson',
    pet: 'Bella',
    service: 'Full Grooming',
    date: '2023-10-25',
    time: '10:00 AM',
    status: 'Confirmed',
    amount: '$85.00',
  },
  {
    id: 2,
    client: 'Bob Smith',
    pet: 'Max',
    service: 'Bath & Brush',
    date: '2023-10-25',
    time: '11:30 AM',
    status: 'Pending',
    amount: '$45.00',
  },
  {
    id: 3,
    client: 'Carol White',
    pet: 'Lucy',
    service: 'Nail Trim',
    date: '2023-10-26',
    time: '09:15 AM',
    status: 'Completed',
    amount: '$25.00',
  },
  {
    id: 4,
    client: 'David Brown',
    pet: 'Charlie',
    service: 'Full Grooming',
    date: '2023-10-26',
    time: '02:00 PM',
    status: 'Cancelled',
    amount: '$90.00',
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    Confirmed: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-blue-100 text-blue-700',
    Cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  );
};

export const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState(initialAppointments);

  const filteredAppointments = appointments.filter(
    (app) =>
      app.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.pet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 mt-1">Manage your grooming schedule</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="h-4 w-4" />
          New Appointment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client or pet name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
              <CalendarIcon className="h-4 w-4" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
              <Clock className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Client / Pet</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{app.client}</div>
                    <div className="text-xs text-gray-500">Pet: {app.pet}</div>
                  </td>
                  <td className="px-6 py-4">{app.service}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{app.date}</div>
                    <div className="text-xs text-gray-500">{app.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {app.amount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAppointments.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No appointments found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};
