import React, { useState } from "react";
import { Layout, List, Input, Avatar, Button, Space, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Header, Content, Footer } = Layout;

function Chat() {
  const [messages, setMessages] = useState([
    {
      user: "Cliente",
      message: "Olá, gostaria de marcar uma reunião para discutir um projeto.",
      timestamp: "09:00",
    },
    {
      user: "Empresa",
      message:
        "Olá! Claro, ficaremos felizes em ajudar. Quando seria um bom momento para você?",
      timestamp: "09:02",
    },
    {
      user: "Cliente",
      message:
        "Eu tenho disponibilidade na próxima terça-feira pela manhã. E vocês?",
      timestamp: "09:05",
    },
    {
      user: "Empresa",
      message:
        "Terça-feira pela manhã funciona bem. Podemos marcar às 10h. Que tal?",
      timestamp: "09:10",
    },
    {
      user: "Cliente",
      message: "10h está ótimo para mim! Qual será a pauta da reunião?",
      timestamp: "09:12",
    },
    {
      user: "Empresa",
      message:
        "A pauta será a apresentação do projeto e discussão sobre os próximos passos. Podemos também revisar a proposta de orçamento.",
      timestamp: "09:15",
    },
    {
      user: "Cliente",
      message:
        "Perfeito. Eu já tenho alguns detalhes para compartilhar sobre o projeto também.",
      timestamp: "09:20",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageObj = {
        user: "Eu",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, newMessageObj]);
      setNewMessage("");
    }
  };

  return (
    <>
      <Title level={2}>Conversas</Title>

      <Content
        style={{
          height: "calc(100% - 80px)",
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{item.user.charAt(0)}</Avatar>}
                title={item.user}
                description={item.message}
              />
              <span style={{ fontSize: "12px", color: "#aaa" }}>
                {item.timestamp}
              </span>
            </List.Item>
          )}
        />
      </Content>
    </>
  );
}

export default Chat;
