import React from "react";
import { Typography, Table, Dropdown, Menu } from "antd";
import { FaEllipsisV, FaWhatsapp } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
const { Title } = Typography;

// Dados de exemplo para a tabela de contatos
const data = [
  {
    key: "1",
    name: "Alice Silva",
    email: "alice.silva@example.com",
    phone: "(11) 98765-4321",
    address: "Rua das Flores, 123, São Paulo, SP",
  },
  {
    key: "2",
    name: "Bruno Costa",
    email: "bruno.costa@example.com",
    phone: "(21) 98765-4321",
    address: "Av. Central, 456, Rio de Janeiro, RJ",
  },
  {
    key: "3",
    name: "Carlos Lima",
    email: "carlos.lima@example.com",
    phone: "(31) 98765-4321",
    address: "Rua da Paz, 789, Belo Horizonte, MG",
  },
];

// Função para gerar o menu de ações com o link do WhatsApp
const actionMenu = (phone) => (
  <Menu>
    <Menu.Item
      icon={<FaWhatsapp />}
      key="1"
      onClick={() =>
        window.open(`https://wa.me/55${phone.replace(/\D/g, "")}`, "_blank")
      }
    >
      Entrar em contato
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

// Definição das colunas para a tabela
const columns = [
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "E-mail",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Telefone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Endereço",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Ações",
    width: 20,
    render: (val, row) => {
      return (
        <Dropdown overlay={actionMenu(row.phone)} trigger={["click"]}>
          <FaEllipsisV />
        </Dropdown>
      );
    },
  },
];

function Contact() {
  return (
    <>
      <Title level={2}>Contatos</Title>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
    </>
  );
}

export default Contact;
