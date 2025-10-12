import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route
} from "react-router-dom";
import './css/index.css';
import Home from './Home';
import NotFoundPage from './pages/NotFoundPage';
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
        {/* <Route
          path="/"
          element={<Navigate to="/welcome" replace />}
        /> */}
        <Route
          path="/"
          element={<Home />}
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
