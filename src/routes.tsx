import React from 'react';
import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Appointments } from './pages/Appointments';
import { Clients } from './pages/Clients';
import { Services } from './pages/Services';
import { Breeds } from './pages/Breeds';
import { Pets } from './pages/Pets';
import { ServiceConfigurations } from './pages/ServiceConfigurations'
import { Login } from  './pages/Login';

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
        path: 'serviceConfigurations',
        Component: ServiceConfigurations,
      },
      {
        path: 'breeds',
        Component: Breeds,
      },
      {
        path: 'pets',
        Component: Pets,
      },
      {
        path: 'login',
        Component: Login,
      }
    ],
  },
]);
