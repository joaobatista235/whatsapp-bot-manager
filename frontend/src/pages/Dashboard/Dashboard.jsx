import React from "react";
import { Button, Table, Typography } from "antd";
import { Div } from "../../styles/style";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const data = [
  {
    key: "1",
    nameCompany: "Empresa A",
    context: "Atendimento ao Cliente",
    apiKey: "12345",
    modelIA: "gpt-3.5",
    objective: "Vendas",
    communication: "Normal",
    nameAgent: "Agente A",
    sector: "Tecnologia",
  },
  {
    key: "2",
    nameCompany: "Empresa B",
    context: "Suporte Técnico",
    apiKey: "67890",
    modelIA: "gpt-3.5",
    objective: "Vendas",
    communication: "Normal",
    nameAgent: "Agente B",
    sector: "Saúde",
  },
];

const Dashboard = () => {
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

      <div style={{ flex: 1, overflow: "auto" }}>
        <Table
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                console.log("click row");
              },
            };
          }}
          bordered
          dataSource={data}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ y: "calc(100vh - 100px)" }} // Ajuste a altura conforme necessário
        />
      </div>
    </Div>
  );
};

export default Dashboard;
