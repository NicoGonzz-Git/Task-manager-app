import React from "react";
import { useMsal } from "@azure/msal-react";

const LoginPage = ({ onLoginSuccess }) => {
    const { instance } = useMsal();
  
    const login = async () => {
      try {
        const response = await instance.loginPopup({
          scopes: ["User.Read"],
        });
  
        instance.setActiveAccount(response.account);
        onLoginSuccess();
      } catch (err) {
        console.error("Login error:", err);
      }
    };
  
    return (
      <div>
        <button onClick={login}>Iniciar sesión</button>
      </div>
    );
  };

export default LoginPage;