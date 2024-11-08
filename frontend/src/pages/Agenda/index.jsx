import { Typography, Select } from "antd";
import React, { useState, useEffect, useRef } from "react";
import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";
import scheduler from "dhtmlx-scheduler";

const { Title } = Typography;
const { Option } = Select;

function Agenda() {
  const schedulerContainer = useRef(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const people = [
    { key: 1, label: "Pessoa 1" },
    { key: 2, label: "Pessoa 2" },
    { key: 3, label: "Pessoa 3" },
  ];

  useEffect(() => {
    // Inicializa o scheduler com o idioma português (Brasil) e a visão 'semana'
    scheduler.i18n.setLocale("pt");
    scheduler.init(schedulerContainer.current, new Date(), "week");

    // Dados de exemplo para reuniões com múltiplas pessoas
    const events = [
      {
        id: 1,
        start_date: "2024-11-05 09:00",
        end_date: "2024-11-05 12:00",
        text: "Reunião de Planejamento",
        owner_id: 1, // Pessoa 1
      },
      {
        id: 2,
        start_date: "2024-11-06 09:00",
        end_date: "2024-11-06 12:00",
        text: "Reunião de Revisão",
        owner_id: 2, // Pessoa 2
      },
      {
        id: 3,
        start_date: "2024-11-06 13:00",
        end_date: "2024-11-06 17:00",
        text: "Reunião de Feedback",
        owner_id: 1, // Pessoa 1
      },
      {
        id: 4,
        start_date: "2024-11-07 09:00",
        end_date: "2024-11-07 12:00",
        text: "Reunião de Discussão",
        owner_id: 3, // Pessoa 3
      },
      {
        id: 5,
        start_date: "2024-11-08 09:00",
        end_date: "2024-11-08 18:00",
        text: "Evento habitual",
        owner_id: 2, // Pessoa 2
      },
    ];

    scheduler.parse(events, "json");

    // Configuração do recurso 'owner' para mostrar múltiplos usuários
    scheduler.config.resources = people;

    // Definindo cores diferentes para cada dono de evento (owner_id)
    scheduler.templates.event_class = function (start_date, end_date, event) {
      if (event.owner_id === 1) {
        return "pessoa1-evento"; // Classe CSS para a Pessoa 1
      } else if (event.owner_id === 2) {
        return "pessoa2-evento"; // Classe CSS para a Pessoa 2
      } else if (event.owner_id === 3) {
        return "pessoa3-evento"; // Classe CSS para a Pessoa 3
      }
      return "";
    };

    // Filtrando os eventos com base na pessoa selecionada
    const filterEvents = (ownerId) => {
      const filteredEvents = events.filter(
        (event) => !ownerId || event.owner_id === ownerId
      );
      scheduler.clearAll();
      scheduler.parse(filteredEvents, "json");
    };

    // Atualizando o filtro com base na seleção do select
    if (selectedPerson) {
      filterEvents(selectedPerson);
    } else {
      scheduler.clearAll();
      scheduler.parse(events, "json"); // Exibe todos os eventos quando nenhum filtro é aplicado
    }

    // Configuração para exibir o horário comercial
    scheduler.config.first_hour = 6; // Começa às 09:00
    scheduler.config.last_hour = 21; // Termina às 18:00
    scheduler.config.hour_date = "%H:%i"; // Exibe hora e minuto

    return () => {
      scheduler.clearAll();
    };
  }, [selectedPerson]);

  return (
    <>
      <Title align level={2}>
        Agenda de Reuniões
      </Title>
      <div style={{ marginBottom: "16px" }}>
        <Select
          style={{ width: 200 }}
          placeholder="Selecione uma pessoa"
          onChange={setSelectedPerson}
          value={selectedPerson}
        >
          <Option value={null}>Todos</Option>
          {people.map((person) => (
            <Option key={person.key} value={person.key}>
              {person.label}
            </Option>
          ))}
        </Select>
      </div>
      <div
        ref={schedulerContainer}
        style={{
          width: "calc(100% - 32px)",
          height: "calc(100% - 100px)",
          padding: "16px",
          borderRadius: "8px",
        }}
      ></div>
    </>
  );
}

export default Agenda;
