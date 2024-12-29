import { Menu, Dropdown, Typography } from "antd";
import {
  comunicationOptions,
  industryOptions,
  objectiveOptions,
} from "../../assets/enumHelper.js";
import {
  AiFillEdit,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineFileText,
  AiOutlinePoweroff,
} from "react-icons/ai";

import { FaEllipsisV } from "react-icons/fa";
import { Div } from "../../styles/style.js";

const { Text } = Typography;

export const DashboardColumns = ({
  deleteAgent,
  handleLoad,
  updateAgent,
  navigate,
}) => {
  const actionMenu = (row, index) => (
    <Menu>
      <Menu.Item
        style={{ width: "200px" }}
        onClick={(e) => {
          e.domEvent.stopPropagation();
          navigate(`/agentSignUp`, {
            state: { id: row?.id },
          });
        }}
        icon={<AiFillEdit color="blue" size={"16px"} />}
        key={"editAgent"}
      >
        <Div>
          <Text style={{ fontWeight: "500" }}>Editar Agente</Text>
        </Div>
      </Menu.Item>

      <Menu.Item
        onClick={(e) => {
          e.domEvent.stopPropagation();
          updateAgent(row);
        }}
        icon={
          <AiOutlinePoweroff
            size={"16px"}
            color={row?.status ? "red" : "green"}
          />
        }
        key={row?.status ? "stopAgent" : "startAgent"}
      >
        <Div>
          <Text style={{ fontWeight: "500" }}>
            {row?.status ? "Pausar" : "Iniciar"}
          </Text>
        </Div>
      </Menu.Item>

      <Menu.Item
        onClick={(e) => {
          console.log(e);
          e.domEvent.stopPropagation();
          deleteAgent(row.id).then(() => handleLoad());
        }}
        icon={<AiOutlineDelete size={"16px"} color={"red"} />}
        key="delete"
      >
        <Div>
          <Text style={{ fontWeight: "500" }}>Excluir</Text>
        </Div>
      </Menu.Item>
    </Menu>
  );

  return [
    {
      title: "Nome do Agente",
      dataIndex: "name",
      key: "name",
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
      dataIndex: "companyName",
      key: "companyName",
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (val, row) => {
        return (
          <Div
            $borderRadius="8px"
            justify="center"
            padding={"4px 0"}
            width={"80px"}
            $backgroundColor={val ? "#187925" : "#c92b2b"}
            style={{ fontWeight: "500", color: "white" }}
          >
            {val ? "Ativo" : "Inativo"}
          </Div>
        );
      },
    },

    {
      title: "Ações",
      width: 100,
      render: (val, row, index) => {
        return (
          <Dropdown
            overlay={actionMenu(row, index)}
            trigger={["click"]}
            onClick={(e) => e.stopPropagation()}
          >
            <FaEllipsisV size={"16px"} style={{ width: "100%" }} />
          </Dropdown>
        );
      },
    },
  ];
};
