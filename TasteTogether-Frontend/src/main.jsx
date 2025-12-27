// Fix for "global is not defined" error
window.global = window
import React from "react";
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from "./components/ui/provider.jsx";
import App from './App.jsx'
import process from 'process'
import { Buffer } from 'buffer'

window.process = process
window.Buffer = Buffer
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Provider>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
)
