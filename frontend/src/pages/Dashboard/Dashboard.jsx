import React, { useEffect, useState } from "react";
import { Button, Table, Typography } from "antd";
import { Div } from "../../styles/style";
import { useNavigate } from "react-router-dom";
import { getAgents } from "../../services/agent";

const { Title } = Typography;

const Dashboard = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    getAgents().then((data) => {
      console.log(data);
      setList(data);
    });
  }, []);
  const columns = [
    {
      title: "Empresa",
      dataIndex: "nameCompany",
      key: "nameCompany",
    },
    {
      title: "Nome do Agente",
      dataIndex: "nameAgent",
      key: "nameAgent",
    },
    {
      title: "Objetivo",
      dataIndex: "objective",
      key: "objective",
    },
    {
      title: "Comunicação",
      dataIndex: "communication",
      key: "communication",
    },

    {
      title: "Setor",
      dataIndex: "sector",
      key: "sector",
    },
    {
      title: "Modelo IA",
      dataIndex: "modelIA",
      key: "modelIA",
    },
  ];

  const navigate = useNavigate();
  const handleNewAgent = () => {
    navigate("/agentSignUp");
  };

  return (
    <Div align="left" direction="column" height="calc(100% - 16px)" gap="16px">
      <Div $fullWidth justify="space-between" align="center">
        <Title align level={2}>
          Lista de Agentes
        </Title>
        <Button
          onClick={handleNewAgent}
          size="large"
          style={{
            fontWeight: "600",
            backgroundColor: "#003e51",
            color: "white",
          }}
        >
          Novo Agente
        </Button>
      </Div>
      <Div $fullWidth>
        <Table
          style={{ width: "100%" }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                console.log("click row");
              },
            };
          }}
          bordered
          dataSource={list}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Div>
    </Div>
  );
};

export default Dashboard;
