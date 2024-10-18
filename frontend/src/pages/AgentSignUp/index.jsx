import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header";
import {
  FormControl,
  FormLabel,
  Input,
  Image,
  Spinner,
  Textarea,
  Center,
  useDisclosure,
  Button,
  ButtonGroup,
  Tooltip,
} from "@chakra-ui/react";
import { Div } from "../../styles/style";
import useViewport from "../../_Hooks/useViewPort";

function AgentSignUp() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomeEmpresa: "",
    contexto: "",
    chaveAPI: "",
  });
  const { isMobile } = useViewport(window.innerWidth);
  const _isMobile = isMobile();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/create-bot",
        {
          companyId: formData.nomeEmpresa,
          context: formData.contexto,
          apiKey: formData.chaveAPI,
        }
      );
      setQrCode(response.data.qrcode);
      setLoading(false);
    } catch (error) {
      console.error(
        "Erro ao criar bot:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const initialRef = React.useRef(null);

  const contextTooltip = (
    <Div padding={"16px"} direction="column" gap={"8px"}>
      <Div>
        Informe o conteúdo que será utilizado pela IA para atender os clientes
        via WhatsApp. Neste campo, você deve descrever o contexto específico que
        a IA deve seguir, como informações sobre os produtos ou serviços, o tom
        de comunicação desejado, e qualquer detalhe relevante para personalizar
        o atendimento. Quanto mais detalhado o contexto, mais eficaz e alinhada
        será a resposta da IA às necessidades dos clientes.
      </Div>

      <Div>
        Exemplo: "A IA deve atender clientes interessados em serviços de suporte
        técnico para dispositivos eletrônicos. O tom deve ser amigável e
        profissional, oferecendo respostas rápidas e claras. A IA deve sugerir
        soluções comuns para problemas técnicos e oferecer assistência para
        marcar visitas técnicas, caso necessário. Incluir detalhes sobre os
        horários de funcionamento e informações de contato."{" "}
      </Div>
    </Div>
  );
  return (
    <>
      <Header text="LOGO" />
      <Div
        direction="column"
        width={_isMobile ? "calc(100% - 32px)" : "40%"}
        margin="24px auto"
      >
        <FormControl isRequired>
          <FormLabel>Nome do Agente</FormLabel>

          <Input
            ref={initialRef}
            placeholder="Nome da Agente"
            name="nomeEmpresa"
            value={formData.nomeEmpresa}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl mt={4} isRequired>
          <Tooltip
            borderRadius={"8px"}
            placement="left-start"
            label={contextTooltip}
          >
            <FormLabel>Contexto</FormLabel>
          </Tooltip>
          <Textarea
            placeholder="Contexto"
            name="contexto"
            value={formData.contexto}
            onChange={handleInputChange}
            rows={16}
          />
        </FormControl>
        <FormControl mt={4} isRequired>
          <FormLabel>Chave da OpenAI API</FormLabel>
          <Input
            placeholder="Chave da OpenAI API"
            name="chaveAPI"
            value={formData.chaveAPI}
            onChange={handleInputChange}
          />
        </FormControl>
        {qrCode && (
          <FormControl mt={4}>
            <FormLabel>QR Code:</FormLabel>
            <Center>
              {loading ? (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              ) : (
                qrCode && <Image src={`${qrCode}`} alt="QR Code" />
              )}
            </Center>
          </FormControl>
        )}
        <FormControl mt={4}>
          <ButtonGroup width={"100%"} justifyContent={"space-between"}>
            <Button onClick={handleCancel} colorScheme="red">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} colorScheme="green">
              Criar
            </Button>
          </ButtonGroup>
        </FormControl>
      </Div>
    </>
  );
}

export default AgentSignUp;
