/**
 * Application Entry Point
 * 
 * This file initializes the React application with:
 * - Redux store for state management
 * - Redux Persist for data persistence
 * - React Router for navigation
 * - Bootstrap CSS for styling
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    {/* Redux Provider for state management */}
    <Provider store={store}>
      {/* Redux Persist Gate for data persistence */}
      <PersistGate loading={null} persistor={persistor}>
        {/* React Router for navigation */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
