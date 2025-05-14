import { useMsal } from "@azure/msal-react";
import { Button, makeStyles, tokens } from "@fluentui/react-components";
import { apiScopes } from "../../auth/auth-config";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalL,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "50%"
  },
});

const LoginPage = ({ onLoginSuccess }) => {
  const { instance } = useMsal();
  const styles = useStyles();

  const login = async () => {
    try {
      const response = await instance.loginPopup({
        scopes: apiScopes,
      });
      instance.setActiveAccount(response.account);
      onLoginSuccess();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.container}>
      <Button appearance="primary" onClick={login}>
        Login
      </Button>
    </div>

  );
};

export default LoginPage;