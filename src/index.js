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
import StripeCheckoutPage from './pages/StripeCheckoutPage';
import BillingPlansPage from './pages/BillingPlansPage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import SessionManager from './components/SessionManager';
import { GlobalStateProvider } from './context/GlobalStateProvider';
import globalReducer, { initialState } from './context/globalReducer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GlobalStateProvider
    initialState={initialState}
    globalReducer={globalReducer}
  >
    <BrowserRouter>
      <SessionManager>
        <Routes>
          {/* TODO JOAQUIN: create https://www.notionwallet.com/privacy-policy and https://www.notionwallet.com/terms-of-service */}
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
          {/* Route for Stripe checkout page callback - requires authentication */}
          <Route
            path="/stripe-checkout-page"
            element={
              <ProtectedRoute>
                <StripeCheckoutPage />
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
          {/* Route for the billing plans page */}
          <Route
            path="/billing-plans"
            element={
              <ProtectedRoute>
                <BillingPlansPage />
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
      </SessionManager>
    </BrowserRouter>
  </GlobalStateProvider>
);
