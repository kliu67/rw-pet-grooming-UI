import React, { useState } from 'react';
import { Routes, Route } from "react-router";
// import { HomePage } from './pages/HomePage';
import {HomePage} from './pages/HomePage';
import {ConfirmPage} from "./pages/ConfirmPage";
import { NotFoundPage } from './pages/NotFoundPage';
import {ErrorPage} from './pages/ErrorPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/confirmation/:appId" element={<ConfirmPage />} />
      <Route path="/error" element={<ErrorPage />} />
    </Routes>
  );
}
