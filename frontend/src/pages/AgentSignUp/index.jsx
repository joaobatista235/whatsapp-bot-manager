import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Radio, Select, Typography, Input, Spin } from "antd";

const { Title, Text } = Typography;
const { TextArea } = Input;

import {
  FormControl,
  FormLabel,
  Button,
  ButtonGroup,
  Tooltip,
} from "@chakra-ui/react";

import { Div } from "../../styles/style";
import {
  comunicationOptions,
  industryOptions,
  objectiveOptions,
} from "../../assets/enumHelper.js";
import useApiRequest from "../../_Hooks/useApiRequest.js";
import { getAgentById } from "../../services/agent.js";

function AgentSignUp() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    context: "",
    objective: objectiveOptions[0].value,
    communication: comunicationOptions[0].value,
    name: "",
    sector: industryOptions[0].value,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const myParam = location?.state?.id;

  useEffect(() => {
    if (!myParam) return;
    getAgentById(myParam).then((agent) => {
      setFormData({
        companyName: agent?.companyName,
        context: agent?.context,
        objective: agent?.objective,
        communication: agent?.communication,
        name: agent?.name,
        sector: agent?.sector,
        ...agent,
      });
    });
  }, [myParam]);

  const { handleCreate, handleUpdate } = useApiRequest({
    endpoint: "agent",
    showToast: true,
    message: myParam ? "Atualizado com sucesso!" : "Criado com sucesso!",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    setLoading(true);

    const fn = myParam ? handleUpdate : handleCreate;
    fn({ ...formData }).then(() => {
      setLoading(false);
      navigate(-1);
    });
  };

  const contextTooltip = (
    <Div padding={"16px"} direction="column" gap={"8px"}>
      <Div>
        {`Informe o conteúdo que será utilizado pela IA para atender os clientes
        via WhatsApp. Neste campo, você deve descrever o contexto específico que
        a IA deve seguir, como informações sobre os produtos ou serviços, o tom
        de comunicação desejado, e qualquer detalhe relevante para personalizar
        o atendimento. Quanto mais detalhado o contexto, mais eficaz e alinhada
        será a resposta da IA às necessidades dos clientes.`}
      </Div>
      <Div>
        {`Exemplo: "A IA deve atender clientes interessados em serviços de suporte
          técnico para dispositivos eletrônicos. O tom deve ser amigável e
          profissional, oferecendo respostas rápidas e claras. A IA deve sugerir
          soluções comuns para problemas técnicos e oferecer assistência para
          marcar visitas técnicas, caso necessário. Incluir detalhes sobre os
          horários de funcionamento e informações de contato."`}
      </Div>
    </Div>
  );

  return (
    <Div direction="column" $fullHeight gap={"16px"}>
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
        $fullHeight
        padding={"24px 32px"}
        height={"calc(100% - 100px)"}
        $borderRadius="8px"
        $backgroundColor="white"
      >
        <Div direction="column" width={"100%"} gap="16px" $fullHeight>
          <Div $fullWidth gap="32px">
            <FormControl isRequired>
              <FormLabel>Nome do Agente</FormLabel>
              <Input
                placeholder="Nome do Agente"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
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
                  <Radio.Button key={i} value={value}>{label}</Radio.Button>
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
                  <Radio.Button key={i} value={value}>{label}</Radio.Button>
                ))}
              </Radio.Group>
            </FormControl>
          </Div>

          <Div $fullWidth gap="32px">
            <FormControl isRequired>
              <FormLabel>Nome da Empresa</FormLabel>
              <Input
                placeholder="Nome da Empresa"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Setor/Indústria</FormLabel>
              <Select
                name="sector"
                defaultValue={formData.sector}
                value={formData.sector}
                style={{
                  width: "100%",
                }}
                options={industryOptions}
                onChange={(value) =>
                  handleInputChange({ target: { name: "sector", value } })
                }
              />
            </FormControl>
          </Div>

          <FormControl style={{ height: "100%" }} isRequired>
            <Tooltip borderRadius={"8px"} label={contextTooltip}>
              <FormLabel>Contexto</FormLabel>
            </Tooltip>
            <TextArea
              placeholder="Descreva o contexto aqui..."
              name="context"
              style={{ height: "calc(100% - 32px)" }}
              value={formData.context}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <Spin spinning={loading} style={{ width: "100%", height: "100%" }}>
              <ButtonGroup width={"100%"} justifyContent={"space-between"}>
                <Button onClick={() => navigate(-1)} colorScheme="gray">
                  Voltar
                </Button>
                <Button onClick={handleSubmit} colorScheme="green">
                  {myParam ? "Atualizar" : "Criar"}
                </Button>
              </ButtonGroup>
            </Spin>
          </FormControl>
        </Div>
      </Div>
    </Div>
  );
}

export default AgentSignUp;
