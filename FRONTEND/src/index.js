import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// `PUBLIC_URL` is "" for the real production build (served at the domain
// root) and "/staging" for a staging build (see PLAN.md's staging deploy
// steps) — without passing it as `basename`, the router would try to match
// the current URL's full path (e.g. "/staging/thank-you") against routes
// registered as absolute paths ("/thank-you"), fail, and fall through to
// the 404 page; every in-app <Link to="/..."> would also resolve outside
// the /staging prefix entirely, silently redirecting a staging visitor to
// the real production site's root.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
