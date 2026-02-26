import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ModalProvider } from "./components/modals/ModalProvider";


export default function App() {
  return (
  <ModalProvider>
    <RouterProvider router={router} />;
    </ModalProvider>
  )
}
