import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import LoginPage from "../users/UsersLogin";

const AuthGate = ({ children }) => {
  const { instance } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const activeAccount = instance.getActiveAccount();
    const allAccounts = instance.getAllAccounts();

    if (!activeAccount && allAccounts.length > 0) {
      instance.setActiveAccount(allAccounts[0]);
      setIsAuthenticated(true);
    }

    if (activeAccount) {
      setIsAuthenticated(true);
    }
  }, [instance]);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return <>{children}</>;
};

export default AuthGate;