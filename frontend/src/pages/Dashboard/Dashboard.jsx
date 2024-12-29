import { useEffect, useState } from "react";
import { Button, Image, Modal, Table, Typography } from "antd";
import { Div } from "../../styles/style";
import { useNavigate } from "react-router-dom";
import { getAgents } from "../../services/agent";
import useApiRequest from "../../_Hooks/useApiRequest.js";
import { DashboardColumns } from "./DashboardColumns.jsx";

const { Title, Text } = Typography;

const Dashboard = () => {
  const [list, setList] = useState([]);
  const [qrCode, setQrCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const { handleDelete: deleteAgent } = useApiRequest({
    endpoint: "agent",
    showToast: true,
    message: "Deletado com sucesso !",
  });

  const { handleUpdate: startAgent } = useApiRequest({
    endpoint: "agent/startAgent",
    showToast: true,
    message: "Ativado com sucesso !",
  });

  const { handleUpdate: stopAgent } = useApiRequest({
    endpoint: "agent/stopAgent",
    showToast: true,
    message: "Inativo com sucesso !",
  });

  const handleLoad = () => {
    getAgents().then((data) => {
      setList(data);
    });
  };

  useEffect(() => {
    handleLoad();
  }, []);

  const updateAgent = (row) => {
    const activate = !row?.status;
    if (activate) {
      setIsModalOpen(true);
      setModalLoading(true);
    }
    const fn = activate ? startAgent : stopAgent;
    fn({ id: row.id }).then((resp) => {
      if (!activate) {
        handleLoad();
        return;
      }
      setQrCode(resp?.qrcode);
      setModalLoading(false);
    });
  };

  const navigate = useNavigate();

  const _columns = DashboardColumns({
    deleteAgent,
    handleLoad,
    updateAgent,
    navigate,
    navigate,
  });

  const handleLogin = () => {
    fetch("http://localhost:3000/")
      .then((response) => response.json())
      .then((data) => {
        window.location.href = data.url;
      })
      .catch((error) =>
        console.error("Erro ao redirecionar para o Google", error)
      );
  };

  return (
    <Div align="left" direction="column" height="calc(100% - 16px)" gap="16px">
      <Div $fullWidth justify="space-between" align="center">
        <Title align level={2}>
          Lista de Agentes
        </Title>
        <Button onClick={handleLogin}>Login com Google</Button>
        <Button
          onClick={() => navigate("/agentSignUp")}
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
        {isModalOpen && (
          <Modal
            title="QR Code"
            open={isModalOpen}
            loading={modalLoading}
            footer={null}
            onCancel={() => {
              setIsModalOpen(false);
              handleLoad();
            }}
          >
            <Div
              $fullWidth
              margin="32px 0  0 0"
              direction="column"
              justify="center"
              gap="32px"
            >
              {qrCode && (
                <>
                  <Image src={`${qrCode}`} alt="QR Code" />{" "}
                  <Text
                    style={{ textAlign: "center", fontWeight: "bold" }}
                    strong={true}
                  >
                    Para conectarmos o agente, abra o WhatsApp no seu celular,
                    vá em Aparelhos Conectados, toque em Conectar um Aparelho e
                    escaneie o QR code exibido na tela.
                  </Text>
                </>
              )}
            </Div>
          </Modal>
        )}
        <Table
          style={{ width: "100%" }}
          bordered
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                navigate(`/chats`, {
                  state: { id: list[rowIndex]?.id },
                });
              },
            };
          }}
          dataSource={list}
          columns={_columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Div>
    </Div>
  );
};

export default Dashboard;
