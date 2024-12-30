import { Typography, List, Avatar, Button, message, Tooltip } from "antd";
import { Div } from "../../styles/style";
import { useState, useEffect } from "react";
import {
  AiOutlineWhatsApp,
  AiOutlineStop,
  AiOutlineSync,
} from "react-icons/ai";
import { collection, query, onSnapshot, doc, getDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { db } from "../../config/firebase";
import useApiRequest from "../../_Hooks/useApiRequest";
const { Title, Text } = Typography;

function ChatHistory() {
  const location = useLocation();
  const myParam = location?.state?.id;
  console.log(myParam);

  const [conversations, setConversations] = useState([]);

  const { handleUpdate: handleThread } = useApiRequest({
    endpoint: "agent/handleThread",
    showToast: true,
    message: "Pausado com sucesso !",
  });

  useEffect(() => {
    const unsubscribe = () => {};

    const fetchMessages = async () => {
      const q = query(collection(db, `threads/${myParam}/messages`));
      const threadRef = doc(db, `threads/${myParam}`);
      unsubscribe = onSnapshot(threadRef, (threadDoc) => {
        const threadData = threadDoc.data();

        unsubscribe = onSnapshot(q, (messagesSnapshot) => {
          const messagesData = messagesSnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .sort((a, b) => a.createdAt - b.createdAt);

          setConversations([
            {
              ...threadData,
              avatar: "https://xsgames.co/randomusers/avatar.php?g=male",
              messages: messagesData,
            },
          ]);
        });
      });
    };

    fetchMessages();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [myParam]);

  const _handleThread = () => {
    handleThread({ id: myParam });
  };

  const openWhatsApp = (phone) => {
    window.open(`https://web.whatsapp.com/send?phone=${phone}`, "_blank");
  };

  return (
    <Div align="left" $fullHeight direction="column" gap="16px" padding="16px">
      <Title level={2}>Histórico de Conversas</Title>

      <List
        itemLayout="vertical"
        style={{ height: "100%" }}
        dataSource={conversations}
        size="large"
        renderItem={(conversation) => (
          <List.Item
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "0",
              marginBottom: "16px",
              width: "100%",
            }}
            className="custom-list-item"
            actions={[
              <Div
                $fullWidth
                justify="space-between"
                gap="12px"
                style={{
                  backgroundColor: "#444444",
                  padding: "16px",
                  borderBottomLeftRadius: "8px",
                  borderBottomRightRadius: "8px",
                  flex: 1,
                }}
              >
                <Tooltip title="Abrir no WhatsApp Web">
                  <Button
                    type="primary"
                    icon={<AiOutlineWhatsApp />}
                    onClick={() => openWhatsApp(conversation.phone)}
                    style={{
                      backgroundColor: "#25D366",
                    }}
                  >
                    Abrir Conversa
                  </Button>
                </Tooltip>
                <Tooltip title="Parar respostas do agente">
                  <Button
                    danger={!conversation?.isBlocked}
                    type="primary"
                    icon={
                      !conversation?.isBlocked ? (
                        <AiOutlineStop />
                      ) : (
                        <AiOutlineSync />
                      )
                    }
                    onClick={() => _handleThread()}
                    style={{}}
                  >
                    {conversation?.isBlocked
                      ? "Voltar a responder"
                      : "Parar de responder"}
                  </Button>
                </Tooltip>
              </Div>,
            ]}
          >
            <List.Item.Meta
              title={
                <Div
                  $fullWidth
                  justify="space-between"
                  align="center"
                  style={{
                    backgroundColor: "#444444",
                    padding: "16px",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                >
                  <Div align="center" gap="12px">
                    <Avatar style={{ backgroundColor: "gray" }} size={48} />
                    <Text strong style={{ color: "white" }}>
                      {conversation.name}
                    </Text>
                  </Div>
                  <Text style={{ color: "white" }}>{conversation.phone}</Text>
                </Div>
              }
            />
            <div
              style={{
                maxHeight: "calc(100vh - 350px)",
                overflowY: "auto",
                padding: "16px",
              }}
            >
              {conversations?.[0]?.messages?.map((message) => (
                <Div
                  key={message.id}
                  direction="column"
                  style={{
                    alignItems:
                      message.role !== "agent" ? "flex-start" : "flex-end",
                    margin: "8px 0",
                  }}
                >
                  <div
                    style={{
                      backgroundColor:
                        message.role !== "agent" ? "#e6f7ff" : "#f0f0f0",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      marginBottom: "4px",
                      maxWidth: "80%",
                    }}
                  >
                    <Text>{message.content}</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {new Date(
                      message.createdAt.seconds * 1000
                    ).toLocaleTimeString()}
                  </Text>
                </Div>
              ))}
            </div>
          </List.Item>
        )}
      />
    </Div>
  );
}

export default ChatHistory;
