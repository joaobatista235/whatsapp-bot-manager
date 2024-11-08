import React, { useEffect, useState } from "react";
import { Button, Dropdown, Menu, Table, Typography } from "antd";
import { Div } from "../../styles/style";
import { useNavigate } from "react-router-dom";
import { getAgents } from "../../services/agent";
import {
  comunicationOptions,
  industryOptions,
  objectiveOptions,
} from "../../../../backend/src/assets/enumHelper";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineFileText,
} from "react-icons/ai";
import { FaEllipsisV } from "react-icons/fa";

const { Title } = Typography;

const Dashboard = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    getAgents().then((data) => {
      console.log(data);
      setList(data);
    });
  }, []);

  const actionMenu = (
    <Menu>
      <Menu.Item
        onClick={() => alert("Funcionalidade em desenvolvimento")}
        icon={<AiOutlineEdit />}
        key="1"
      >
        Editar
      </Menu.Item>

      <Menu.Item
        onClick={() => alert("Funcionalidade em desenvolvimento")}
        icon={<AiOutlineFileText />}
        key="3"
      >
        Visualizar
      </Menu.Item>
      <Menu.Item
        onClick={() => alert("Funcionalidade em desenvolvimento")}
        icon={<AiOutlineDelete />}
        key="2"
      >
        Excluir
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Nome do Agente",
      dataIndex: "nameAgent",
      key: "nameAgent",
    },
    {
      title: "Objetivo",
      dataIndex: "objective",
      key: "objective",

      render: (val, row) => {
        const objective = objectiveOptions.find(
          (option) => option.value === val
        );

        return <div>{objective ? objective.label : val}</div>;
      },
    },
    {
      title: "Comunicação",
      dataIndex: "communication",
      key: "communication",

      render: (val, row) => {
        const comunication = comunicationOptions.find(
          (option) => option.value === val
        );

        return <div>{comunication ? comunication.label : val}</div>;
      },
    },
    {
      title: "Empresa",
      dataIndex: "nameCompany",
      key: "nameCompany",
    },
    {
      title: "Setor",
      dataIndex: "sector",
      key: "sector",
      render: (val, row) => {
        const industry = industryOptions.find((option) => option.value === val);

        return <div>{industry ? industry.label : val}</div>;
      },
    },

    {
      title: "Ações",
      width: 20,
      render: (val, row) => {
        return (
          <Dropdown
            style={{ width: "200px" }}
            overlay={actionMenu}
            trigger={["click"]}
          >
            <FaEllipsisV />
          </Dropdown>
        );
      },
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
