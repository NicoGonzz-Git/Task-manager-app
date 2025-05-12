import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import LoginPage from "../users/UsersLogin";
import { apiScopes } from "../../auth/auth-config";

const AuthGate = ({ children }) => {
  const { instance } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const allAccounts = instance.getAllAccounts();

      if (allAccounts.length > 0) {
        instance.setActiveAccount(allAccounts[0]);
        try {
          const result = await instance.acquireTokenSilent({
            scopes: apiScopes,
            account: allAccounts[0],
          });
          
          console.log("Token adquirido:", result);
          localStorage.setItem("accessToken", result.accessToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error al adquirir token:", error);
          if (error.name === "InteractionRequiredAuthError") {
            try {
              const result = await instance.acquireTokenPopup({
                scopes: apiScopes
              });
              localStorage.setItem("accessToken", result.accessToken);
              setIsAuthenticated(true);
            } catch (popupError) {
              console.error("Error en popup:", popupError);
            }
          }
        }
      }
    };

    checkAuth();
  }, [instance]);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return <>{children}</>;
};

export default AuthGate;