# 6.6.1 Visão Geral do Projeto

Como a entidade responsável pela implementação da solução técnica, queremos garantir que a equipa tenha um bom conhecimento do projeto, de como este pode afetar os dados pessoais dos pacientes e se o processamento é realizado de acordo com a legislação.

## Descrição do Projeto e Funcionalidades

O projeto tem como objetivo desenvolver um protótipo de sistema para gestão de solicitações cirúrgicas, marcações e recursos. O sistema permitirá que hospitais e clínicas gerenciem o agendamento de cirurgias e os registos dos pacientes, além de oferecer uma visualização 3D em tempo real da disponibilidade de recursos dentro das instalações, otimizando o agendamento e o uso dos recursos. O projeto também abordará a conformidade com o Regulamento Geral de Proteção de Dados (RGPD), garantindo que o sistema atenda aos requisitos de proteção de dados e gestão de consentimento.

O sistema será composto por vários módulos:

- **Aplicação Web Backoffice**
- **Módulo de Visualização 3D**
- **Módulo de Planeamento/Otimização**
- **Módulo RGPD**
- **Plano de Continuidade de Negócio (PCN)**

O objetivo é expor os estudantes ao desenvolvimento web full-stack, APIs REST, gestão de bases de dados, renderização 3D, otimização usando Prolog e legislação de privacidade (RGPD).

---

## Dados Pessoais Processados pelo Protótipo

De acordo com a descrição do projeto, o protótipo irá processar os seguintes dados pessoais:

### Dados dos Pacientes:
- Nome Completo
- Data de Nascimento
- Género
- Número de Registo Médico (identificador único)
- Informações de Contacto (email, telefone)
- Alergias/Condições Médicas (opcional)
- Contacto de Emergência
- Histórico de Consultas (lista de consultas passadas e futuras)

### Dados da Equipa Médica:
- Nome Completo
- Número de Licença (identificador único)
- Especialização
- Informações de Contacto (email, telefone)
- Horário de Disponibilidade

### Dados dos Utilizadores do Backoffice:
- Nome de Utilizador
- Função (ex.: Administrador, Médico, Enfermeiro, Técnico, Paciente)
- Email

---

## Tipos de Processamento de Dados

Os dados pessoais recolhidos serão sujeitos aos seguintes tipos de processamento:

- **Recolha**: Os dados serão recolhidos diretamente dos pacientes durante o registo e da equipa e administradores durante a criação de perfis.
- **Armazenamento**: Os dados serão armazenados de forma segura numa base de dados, com acesso restrito com base nas funções dos utilizadores.
- **Utilização**: Os dados serão utilizados para gerir o agendamento de cirurgias, otimizar o uso de recursos, fornecer visualização 3D em tempo real da disponibilidade de recursos e garantir a conformidade com o RGPD.
- **Atualização**: Pacientes e equipa poderão atualizar os seus dados pessoais através dos seus perfis. Os administradores também poderão editar os perfis de pacientes e da equipa.
- **Eliminação**: Os pacientes poderão solicitar a eliminação das suas contas e de todos os dados associados. Os administradores podem eliminar os perfis dos pacientes e desativar os perfis da equipa.

---

## Base Legal para o Processamento de Dados Pessoais

A base legal para o processamento de dados pessoais neste projeto é o **consentimento explícito** dos pacientes para o processamento dos seus dados para fins de cuidados de saúde. Para a equipa e administradores, a base legal é o **contrato de trabalho**, que exige o processamento dos dados para fins de gestão de colaboradores e do sistema. O projeto também garantirá a conformidade com o RGPD, o que significa que o processamento dos dados será feito de forma **legal**, **justa** e **transparente**.

# 6.6.2 As a System, I want to notify both users and the responsible authority in case of a data breach, so that I comply with GDPR’s breach notification requirements.

---

## 1. Detecção e Identificação Imediata

Para assegurar a conformidade com o GDPR, o sistema deve ser configurado para **detectar e responder imediatamente a atividades suspeitas** que possam indicar uma violação de dados pessoais.
A detecção rápida é essencial para:
- Cumprir os requisitos de notificação.
- Proteger os direitos dos titulares dos dados.

---

## 2. Notificação à Autoridade de Supervisão (Artigo 33)

De acordo com o **Artigo 33 do GDPR**, o responsável pelo tratamento de dados é obrigado a notificar a autoridade de supervisão competente no prazo de **72 horas** após tomar conhecimento da violação de dados pessoais.

### Requisitos de Notificação
- **Prazo**: Dentro de 72 horas, a menos que a violação seja considerada de baixo risco para os direitos e liberdades dos indivíduos afetados.
- **Conteúdo da Notificação**:
  - **Natureza da Violação**: Descrição do tipo de violação, incluindo categorias e número aproximado de titulares de dados afetados e registos comprometidos.
  - **Dados de Contato**: Nome e detalhes de contato do responsável pela proteção de dados (DPO) ou outro ponto de contato.
  - **Consequências Prováveis**: Explicação das consequências prováveis da violação para os titulares de dados.
  - **Medidas Tomadas**: Ações aplicadas ou planejadas para mitigar os efeitos negativos da violação.

#### Fonte
- **Artigo 33, parágrafo 1 do GDPR**:
  > "Em caso de violação de dados pessoais, o responsável pelo tratamento notifica desse facto a autoridade de controlo competente [...] até 72 horas após ter tido conhecimento da mesma, a menos que a violação dos dados pessoais não seja suscetível de resultar num risco para os direitos e liberdades das pessoas singulares."
- **Artigo 33, parágrafo 3 do GDPR**:
  > "A comunicação referida [...] deve, pelo menos:
  > (a) Descrever a natureza da violação dos dados pessoais [...];
  > (b) Comunicar o nome e os contactos do encarregado da proteção de dados [...];
  > (c) Descrever as prováveis consequências [...];
  > (d) Descrever as medidas adotadas ou propostas para reparar a violação [...]."

---

## 3. Notificação aos Titulares de Dados (Artigo 34)

De acordo com o **Artigo 34 do GDPR**, em caso de violação que represente **alto risco para os direitos e liberdades dos titulares de dados**, estes devem ser informados **sem demora**.

### Conteúdo da Notificação aos Titulares
- **Descrição da Violação**: Explicação clara da violação de dados pessoais, especificando o tipo de dados comprometidos.
- **Orientações de Proteção**: Recomendações de ações para os titulares, como a troca de senhas ou monitoramento de atividades suspeitas.
- **Dados de Contato**: Informações de contato do DPO ou outro responsável para atendimento de dúvidas dos titulares de dados.

#### Fonte
- **Artigo 34 do GDPR**:
  > "Quando a violação dos dados pessoais for suscetível de implicar um elevado risco [...], o responsável pelo tratamento comunica a violação [...] ao titular dos dados sem demora injustificada."
  > "A comunicação [...] descreve em linguagem clara e simples a natureza da violação [...], fornece, pelo menos, as informações e medidas previstas no artigo 33.º, n.º 3, alíneas b), c) e d."

---

## 4. Registro e Documentação (Artigo 33, Parágrafo 5)

O GDPR exige que o controlador **mantenha registos detalhados de todas as violações de dados pessoais** e das ações corretivas tomadas. Estes registos são essenciais para auditorias e para demonstrar conformidade.

### Documentação Exigida
- **Detalhes do Incidente**: Registro de fatos relativos à violação, como a natureza do incidente e os dados afetados.
- **Medidas Corretivas**: Documentação das ações tomadas em resposta à violação e medidas para evitar recorrências.
- **Finalidade**: Permitir auditorias e verificação de conformidade pelas autoridades competentes.

#### Fonte
- **Artigo 33, parágrafo 5 do GDPR**:
  > "O responsável pelo tratamento documenta quaisquer violações de dados pessoais, compreendendo os factos relacionados [...], os respetivos efeitos e a medida de reparação adotada. Essa documentação deve permitir à autoridade de controlo verificar o cumprimento [...]."

---

## Referências

- Regulamento Geral de Proteção de Dados (GDPR), Artigos 33 e 34.

