import { Typography, List, Avatar, Badge } from "antd";
import { Div } from "../../styles/style";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function Chats() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const q = query(collection(db, "threads"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const threadsData = [];
      querySnapshot.forEach((doc) => {
        threadsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setChats(threadsData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(chats);
  }, [chats]);

  return (
    <Div align="left" direction="column" height="calc(100% - 16px)" gap="16px">
      <Div $fullWidth justify="space-between" align="center">
        <Title level={2}>Lista de conversas em tempo real deste agente</Title>
      </Div>

      <List
        itemLayout="horizontal"
        dataSource={chats}
        renderItem={(item) => (
          <List.Item
            style={{
              cursor: "pointer",
              padding: "12px",
              backgroundColor: "white",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
            hover
          >
            <List.Item.Meta
              onClick={() => {
                navigate(`/chat`, {
                  state: { id: item?.id },
                });
              }}
              avatar={
                <Badge dot status={item.status} offset={[-5, 32]}>
                  <Avatar src={item.avatar} size={40} />
                </Badge>
              }
              title={
                <Div $fullWidth justify="space-between" align="center">
                  <span>{item.name}</span>
                  <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    {item.time}
                  </span>
                </Div>
              }
              description={
                <Div $fullWidth justify="space-between" align="center">
                  <span style={{ color: "#8c8c8c" }}>{item.lastMessage}</span>
                  {item.unread > 0 && (
                    <Badge
                      count={item.unread}
                      style={{ backgroundColor: "#1890ff" }}
                    />
                  )}
                </Div>
              }
            />
          </List.Item>
        )}
      />
    </Div>
  );
}

export default Chats;
