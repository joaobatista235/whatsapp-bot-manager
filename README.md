# WhatsApp AI Bot 🤖

![Bot Logo](https://via.placeholder.com/150)

O **WhatsApp AI Bot** é uma solução inovadora baseada em **Venom-bot**, **OpenAI** e **Google APIs**, projetada para facilitar a criação e configuração de bots personalizados para WhatsApp. Com automação inteligente e eficiente, ele é ideal para empresas e usuários que desejam melhorar o atendimento ao cliente e agilizar tarefas como agendamento de reuniões.

---

## Índice 📚

- [Visão Geral](#visão-geral-)
- [Funcionalidades Principais](#funcionalidades-principais-)
- [Público-Alvo](#público-alvo-)
- [Tecnologias Utilizadas](#tecnologias-utilizadas-)
- [Benefícios](#benefícios-)
- [Como Executar](#como-executar-)
- [Estrutura do Projeto](#estrutura-do-projeto-)
- [Contribuição](#contribuição-)
- [Licença](#licença-)

---

## Visão Geral 🌟

O **WhatsApp AI Bot** é uma plataforma que permite criar e configurar bots inteligentes para WhatsApp. Ele utiliza **OpenAI** para respostas contextualizadas e **Google APIs** para agendamento automático de reuniões no Google Calendar. Com uma interface intuitiva, o bot pode ser configurado por usuários não técnicos, oferecendo automação personalizável e monitoramento em tempo real.

---

## Funcionalidades Principais ✨

- **Criação e Configuração de Bots**:
  - Interface intuitiva no front-end para criação e personalização de bots.
  - Criação de fluxos de conversa personalizados.
  - Treinamento de respostas com base em modelos de IA.

- **Acompanhamento em Tempo Real**:
  - Plataforma web para monitoramento das conversas em andamento.
  - Possibilidade de intervenção manual quando necessário.

- **Inteligência Artificial Avançada**:
  - Respostas contextualizadas e inteligentes utilizando a API da OpenAI.
  - Aprendizado contínuo com base nas interações.

- **Integração com Google Calendar**:
  - Agendamento automático de reuniões no Google Calendar.
  - Configuração de assunto e horário das reuniões.

- **Automação Personalizável**:
  - Configuração de palavras-chave para respostas automáticas.
  - Fluxos baseados em regras, integrados com IA, para decisões complexas.

---

## Público-Alvo 🎯

- **Empresas**: Automatização do atendimento ao cliente no WhatsApp.
- **Profissionais Autônomos**: Agendamento automático de compromissos.
- **Organizações**: Melhoria da eficiência operacional com bots inteligentes.

---

## Tecnologias Utilizadas 🛠️

### Backend
- **Node.js**: Para gerenciamento das interações no WhatsApp.
- **Venom-bot**: Biblioteca para integração com o WhatsApp.
- **OpenAI API**: Para respostas baseadas em IA.
- **Google APIs**: Para automação de agendamento no Google Calendar.

### Frontend
- **React.js**: Interface moderna e intuitiva para configuração e gerenciamento dos bots.

### Banco de Dados
- **Firebase**: Armazenamento de configurações dos bots e logs de interações.

### Hospedagem
- **Heroku**: Garantia de disponibilidade contínua.

---

## Benefícios 🌟

- **Eficiência**: Reduz o tempo gasto em tarefas manuais como agendamento e atendimento.
- **Escalabilidade**: Suporte para múltiplos bots com configurações individuais.
- **Simplicidade**: Interface amigável para usuários não técnicos.
- **Automação Inteligente**: Respostas precisas e contextualizadas, agendamento integrado e personalização robusta.
- **Controle**: Monitoramento em tempo real das conversas pela plataforma web.

---

## Como Executar 🚀

Siga os passos abaixo para rodar o projeto localmente:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/whatsapp-ai-bot.git
   cd whatsapp-ai-bot
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   - Crie um arquivo `.env` na raiz do projeto.
   - Adicione as seguintes variáveis:
     ```env
     WHATSAPP_SESSION=seu_token_do_whatsapp
     OPENAI_API_KEY=sua_chave_da_api_openai
     GOOGLE_API_KEY=sua_chave_da_api_google
     FIREBASE_CONFIG=sua_configuracao_do_firebase
     ```

4. **Execute o projeto**:
   ```bash
   npm start
   ```

---

## Estrutura do Projeto 🗂️

```
whatsapp-ai-bot/
├── frontend/              # Interface do usuário (React.js)
├── backend/               # Lógica do bot (Node.js)
│   ├── venom-bot/         # Integração com WhatsApp
│   ├── openai/            # Integração com OpenAI
│   ├── google-calendar/   # Integração com Google Calendar
│   └── index.js           # Ponto de entrada do backend
├── .env                   # Variáveis de ambiente
├── .gitignore             # Arquivos ignorados pelo Git
├── package.json           # Dependências do projeto
└── README.md              # Documentação do projeto
```

---

## Contribuição 🤝

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b feature/nova-feature
   ```
3. Commit suas alterações:
   ```bash
   git commit -m "Adiciona nova feature"
   ```
4. Envie as alterações:
   ```bash
   git push origin feature/nova-feature
   ```
5. Abra um Pull Request.

---

## Licença 📜

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com ❤️ por [Seu Nome](https://github.com/joaobatista235).
