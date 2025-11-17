import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './App/context/AuthContext';
import { ReportProvider } from './App/context/ReportContext';
import { ToastProvider } from './App/context/ToastContext';
import AppStack from './App/navigation/AppStack';

export default function App() {
  return (
    <AuthProvider>
      <ReportProvider>
        <ToastProvider>
          <AppStack />
          <StatusBar style="light" />
        </ToastProvider>
      </ReportProvider>
    </AuthProvider>
  );
}
