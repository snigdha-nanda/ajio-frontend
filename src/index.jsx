// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
// If your store file is named store.jsx use './store.jsx', 
// if it's store.js use './store' or rename it to store.jsx and keep this.
import { store } from './store.jsx';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
