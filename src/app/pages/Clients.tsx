import React, { useState } from 'react';
import {
  MoreHorizontal,
  Plus,
  Search,
  User,
  PawPrint,
} from 'lucide-react';

const initialClients = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '(555) 123-4567',
    pets: ['Bella (Golden Retriever)', 'Max (Labrador)'],
    lastVisit: '2023-10-15',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '(555) 987-6543',
    pets: ['Charlie (Beagle)'],
    lastVisit: '2023-09-28',
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol@example.com',
    phone: '(555) 555-5555',
    pets: ['Lucy (Poodle)', 'Daisy (Pug)'],
    lastVisit: '2023-10-05',
  },
];

export const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState(initialClients);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">Manage your client database</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="h-4 w-4" />
          Add Client
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Pets</th>
                <th className="px-6 py-4">Last Visit</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{client.name}</div>
                        <div className="text-xs text-gray-500">ID: #{client.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{client.email}</div>
                    <div className="text-xs text-gray-500">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {client.pets.map((pet, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium"
                        >
                          {pet}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{client.lastVisit}</td>
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
        
        {filteredClients.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No clients found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};
