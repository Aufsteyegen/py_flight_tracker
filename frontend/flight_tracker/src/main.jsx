import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
    domain="dev-o0y8i1nzau14d3bt.us.auth0.com"
    clientId="8A7pD9G9tdwzc1c7PhV4triPkT3MGW0F"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    >
        <App />
    </Auth0Provider>
  </React.StrictMode>,
)
