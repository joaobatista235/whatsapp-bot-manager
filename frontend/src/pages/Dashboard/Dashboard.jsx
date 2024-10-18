import React, { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";

import Header from "../../components/header";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [onClickButton, setOnClickButton] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (onClickButton) navigate("/agentSignUp");
  }, [onClickButton]);

  return (
    <>
      <Header
        text={"LOGO"}
        action={
          <Button onClick={() => setOnClickButton(true)}>Criar Agente</Button>
        }
      />
    </>
  );
};

export default Dashboard;
