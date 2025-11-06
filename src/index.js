import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route
} from "react-router-dom";
import './css/index.css';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import NotionCallbackPage from './pages/NotionCallbackPage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import { GlobalStateProvider } from './context/GlobalStateProvider';
import globalReducer, { initialState } from './context/globalReducer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GlobalStateProvider
    initialState={initialState}
    globalReducer={globalReducer}
  >
    <BrowserRouter>
      <Routes>
        {/* Route for the landing page */}
        <Route
          path="/"
          element={<LandingPage />}
        />
        {/* Route for the login page */}
        <Route
          path="/login"
          element={<LoginPage />}
        />
        {/* Route for Notion OAuth callback - requires authentication */}
        <Route
          path="/notion/callback"
          element={
            <ProtectedRoute>
              <NotionCallbackPage />
            </ProtectedRoute>
          }
        />
        {/* Route for the dashboard page */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        {/* Adding a route for the not-found page */}
        <Route
          path="/not-found"
          element={<NotFoundPage />}
        />
        {/* 3. Add the catch-all redirect route at the end */}
        <Route
          path="*"
          element={<Navigate to="/not-found" replace />}
        />
      </Routes>
    </BrowserRouter>
  </GlobalStateProvider>
);
