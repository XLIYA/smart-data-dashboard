// ------------------------------
// src/main.tsx
// ------------------------------
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Landing from './routes/Landing'
import Preview from './routes/Preview'
import Dashboard from './routes/Dashboard'

const router = createBrowserRouter([
  {
    path: '/', element: <App />, children: [
      { index: true, element: <Landing /> },
      { path: 'preview', element: <Preview /> },
      { path: 'dashboard', element: <Dashboard /> },
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
