import React, { useState } from 'react';
import { Routes, Route, useLocation } from "react-router";
import { useEffect } from "react";
// import { HomePage } from './pages/HomePage';
import {HomePage} from './pages/HomePage';
import {ConfirmPage} from "./pages/ConfirmPage";
import { NotFoundPage } from './pages/NotFoundPage';
import {ErrorPage} from './pages/ErrorPage';
import { trackPageView } from "./lib/analytics";

function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const search = location.search || "";
    trackPageView(`${location.pathname}${search}`);
  }, [location.pathname, location.search]);

  return null;
}

export default function App() {
  return (
    <>
      <RouteAnalytics />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/confirmation/:appId" element={<ConfirmPage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </>
  );
}
