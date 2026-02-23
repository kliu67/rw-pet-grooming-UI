import React from 'react';
import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Appointments } from './pages/Appointments';
import { Clients } from './pages/Clients';
import { Services } from './pages/Services';
import { Species } from './pages/Species';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: 'appointments',
        Component: Appointments,
      },
      {
        path: 'clients',
        Component: Clients,
      },
      {
        path: 'services',
        Component: Services,
      },
      {
        path: 'species',
        Component: Species,
      }
    ],
  },
]);
