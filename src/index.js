import React from 'react';
import ReactDOM from 'react-dom/client';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import App from './App';
import {MsalProvider} from '@azure/msal-react';
import { msalConfig } from './auth/auth-config';
import { PublicClientApplication } from '@azure/msal-browser';
import AuthGate from './components/auth/AuthGate';

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <MsalProvider instance={msalInstance}>
    <FluentProvider theme={webLightTheme}>
      <AuthGate>
        <App />
      </AuthGate>
    </FluentProvider>
  </MsalProvider>
);