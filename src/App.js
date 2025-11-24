import { Layout } from "antd";
import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import GroceryForm from "./components/GroceryForm";

const { Header, Content } = Layout;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ color: "white" }}>Grocery Management System</Header>
      <Content
        style={{
          padding: "50px",
          maxHeight: "calc(100% - 64px)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: isLoggedIn ? "flex-start" : "center",
          gap: "20px",
        }}
      >
        {isLoggedIn ? (
          <GroceryForm />
        ) : (
          <>
            <LoginForm onSuccess={handleLoginSuccess} />
            <SignupForm />
          </>
        )}
      </Content>
    </Layout>
  );
}

export default App;
