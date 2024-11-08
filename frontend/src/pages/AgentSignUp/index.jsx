import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Radio, Select, Typography, Input, Modal } from "antd";

const { Title, Text } = Typography;
const { TextArea } = Input;

import {
  FormControl,
  FormLabel,
  Image,
  Button,
  ButtonGroup,
  Tooltip,
} from "@chakra-ui/react";
import { Div } from "../../styles/style";
import useViewport from "../../_Hooks/useViewPort";
import { chatGptModelOptions, comunicationOptions, industryOptions, objectiveOptions } from "../../../../backend/src/assets/enumHelper";

function AgentSignUp() {
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nameCompany: "",
    context: "",
    apiKey: "",
    modelIA: chatGptModelOptions[0].value,
    objective: "sale",
    communication: "normal",
    nameAgent: "",
    sector: industryOptions[0].value,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleOk = () => {
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    setIsModalOpen(true);
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/create-bot",
        {
          ...formData,
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

  return (
    <Div direction="column" gap={"16px"}>
      <Div
        direction="column"
        align="left"
        width="100%"
        margin={"0 auto"}
        padding={"24px 32px"}
        $borderRadius="8px"
        $backgroundColor="white"
      >
        <Title level={2}>Agentes de IA</Title>
        <Text style={{ textAlign: "justify" }}>
          Aqui você consegue criar, configurar e treinar os seus agentes de IA.
          Lembrando que o agente IA é um especialista; portanto, se a tarefa
          dele for mais específica, provavelmente ele terá um nível de acertos
          em um tempo menor.
        </Text>
      </Div>
      <Div
        direction="column"
        align="left"
        width="100%"
        margin={"0 auto"}
        padding={"24px 32px"}
        $borderRadius="8px"
        $backgroundColor="white"
      >
        <Div
          direction="column"
          width={_isMobile ? "calc(100% - 32px)" : "100%"}
          gap="16px"
        >
          <Div $fullWidth gap="32px">
            <FormControl isRequired>
              <FormLabel>Nome do Agente</FormLabel>
              <Input
                placeholder="Nome do Agente"
                name="nameAgent"
                value={formData.nameAgent}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Modelo de IA</FormLabel>
              <Select
                onChange={handleInputChange}
                defaultValue={formData.modelIA}
                style={{
                  width: "100%",
                }}
                options={chatGptModelOptions}
              />
            </FormControl>
          </Div>

          <Div $fullWidth gap="32px">
            <FormControl isRequired>
              <FormLabel>Objetivo do Agente</FormLabel>

              <Radio.Group
                name="objective"
                value={formData.objective}
                onChange={handleInputChange}
              >
                {objectiveOptions.map(({ value, label }, i) => (
                  <Radio.Button value={value}>{label}</Radio.Button>
                ))}
              </Radio.Group>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Forma de comunicação</FormLabel>

              <Radio.Group
                name="communication"
                value={formData.communication}
                onChange={handleInputChange}
              >
                {comunicationOptions.map(({ value, label }, i) => (
                  <Radio.Button value={value}>{label}</Radio.Button>
                ))}
              </Radio.Group>
            </FormControl>
          </Div>

          <Div $fullWidth gap="32px">
            <FormControl isRequired>
              <FormLabel>Nome da Empresa</FormLabel>
              <Input
                placeholder="Nome da Empresa"
                name="nameCompany"
                value={formData.nameCompany}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Setor/Indústria</FormLabel>
              <Select
                name="sector"
                defaultValue={formData.sector}
                style={{
                  width: "100%",
                }}
                options={industryOptions}
              />
            </FormControl>
          </Div>

          <FormControl isRequired>
            <Tooltip
              borderRadius={"8px"}
              placement="left-start"
              label={contextTooltip}
            >
              <FormLabel>Contexto</FormLabel>
            </Tooltip>
            <TextArea
              placeholder="Descreva o contexto aqui..."
              name="context"
              value={formData.context}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Chave da OpenAI API</FormLabel>
            <Input
              placeholder="Chave da OpenAI API"
              name="apiKey"
              value={formData.chaveAPI}
              onChange={handleInputChange}
            />
          </FormControl>
          {isModalOpen && (
            <Modal
              title="QR Code"
              open={isModalOpen}
              loading={loading}
              footer={null}
              onCancel={() => navigate(-1)}
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
                      s
                      strong={true}
                    >
                      Para conectarmos o agente, abra o WhatsApp no seu celular,
                      vá em Aparelhos Conectados, toque em Conectar um Aparelho
                      e escaneie o QR code exibido na tela.
                    </Text>
                  </>
                )}
              </Div>
            </Modal>
          )}
          <FormControl>
            <ButtonGroup width={"100%"} justifyContent={"space-between"}>
              <Button onClick={() => navigate(-1)} colorScheme="gray">
                Voltar
              </Button>

              <Button onClick={handleSubmit} colorScheme="green">
                Avançar
              </Button>
            </ButtonGroup>
          </FormControl>
        </Div>
      </Div>
    </Div>
  );
}

export default AgentSignUp;
