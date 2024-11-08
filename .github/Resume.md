# Backend CI/CD Workflow

Este pipeline de **CI/CD (Integração Contínua e Entrega Contínua)** automatiza o processo de construção, testes, empacotamento e implantação de uma aplicação .NET em um servidor remoto.

## Objetivo

O workflow é executado de duas formas:

1. **Agendado**: Todos os dias às 6:00 AM (UTC).
2. **Manual**: Pode ser disparado manualmente a partir da interface do GitHub.

## Etapas do Workflow

### 1. `on:`

- **schedule**: Define o cronograma de execução, que será executado todos os dias às 6:00 AM (UTC).
- **workflow_dispatch**: Permite disparar o workflow manualmente.

### 2. `defaults:`

- **working-directory**: Define a pasta de trabalho para as etapas, que será `Backend/`.

### 3. `jobs:`

O **job** `deploy` executa as seguintes etapas:

#### 3.1. `Checkout`

- Faz o *checkout* do código mais recente do repositório.

#### 3.2. `Setup .NET 8.0`

- Configura o .NET 8.0 para ser usado no workflow.

#### 3.3. `Install dependencies`

- Restaura as dependências do projeto usando `dotnet restore`.

#### 3.4. `Build`

- Compila o projeto em modo **Release** e coloca os artefatos na pasta `./dist`.

#### 3.5. `Test`

- Executa os testes unitários do projeto para garantir que tudo está funcionando corretamente.

#### 3.6. `Archive production artifacts`

- Faz o upload dos artefatos de compilação gerados para o GitHub.

#### 3.7. `Setup SSH directory`

- Cria o diretório `.ssh`, adiciona a chave privada SSH e configura a autenticação com o servidor remoto.

#### 3.8. `Create target directory`

- Cria o diretório de destino `~/deploy-Backend` no servidor remoto via SSH.

#### 3.9. `Copy Files`

- Usa SCP para transferir os arquivos da aplicação para o servidor remoto, substituindo os arquivos antigos.

#### 3.10. `Deploy Server`

- Executa um script SSH no servidor remoto para:
  - Restaurar as ferramentas .NET necessárias.
  - Aplicar migrações de banco de dados com `dotnet ef database update`.
  - Matar qualquer instância anterior da aplicação e reiniciá-la em segundo plano.

## Objetivo Final

O objetivo desse pipeline é garantir que a aplicação seja construída, testada e implantada automaticamente de maneira eficiente, segura e sem intervenção manual. A aplicação é implantada no servidor remoto com as últimas atualizações e o banco de dados é atualizado automaticamente.
