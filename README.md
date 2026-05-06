# Hotel Schedule Backend

Este repositório contém o backend da aplicação Hotel Schedule, um sistema robusto para gerenciamento de agendamentos e operações hoteleiras. Desenvolvido com uma arquitetura modular em Node.js, Express e Prisma, este serviço oferece uma API RESTful para manipulação de dados de usuários, quartos, reservas, preços e logs de auditoria.

## Visão Geral

O objetivo principal deste projeto é fornecer uma base sólida e escalável para a gestão de um hotel, desde a autenticação de usuários até o controle de agendamentos e auditoria de ações. A aplicação é conteinerizada com Docker, facilitando o desenvolvimento, teste e implantação em diferentes ambientes.

## Funcionalidades Principais

*   **Autenticação e Autorização de Usuários**: Sistema de login/registro e controle de acesso baseado em tokens JWT.
*   **Gerenciamento de Usuários**: CRUD completo para informações de usuários e administradores.
*   **Gestão de Quartos**: Definição e atualização de tipos de quartos e suas características.
*   **Controle de Reservas**: Agendamento, consulta e modificação de reservas de quartos.
*   **Definição de Preços**: Configuração de regras de precificação dinâmica para serviços e quartos.
*   **Logs de Auditoria**: Registro detalhado de ações críticas realizadas no sistema.
*   **Persistência de Dados**: Utilização do Prisma ORM para interação com um banco de dados PostgreSQL.

## Tecnologias Utilizadas

*   **Node.js**: Plataforma de runtime JavaScript.
*   **Express.js**: Framework web para construção da API RESTful.
*   **Prisma ORM**: ORM moderno para Node.js e TypeScript, com tipagem segura e migrações.
*   **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional.
*   **Docker & Docker Compose**: Para conteinerização e orquestração de serviços.
*   **bcrypt**: Para hash seguro de senhas.
*   **jsonwebtoken (JWT)**: Para autenticação baseada em tokens.
*   **Jest**: Framework de testes JavaScript.
*   **Nodemon**: Para desenvolvimento com recarregamento automático.

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

*   **Docker Desktop**: Para construir e executar os contêineres Docker.
*   **Node.js** (versão 20 ou superior): Para desenvolvimento local (opcional, se usar Docker).
*   **npm** (Node Package Manager): Gerenciador de pacotes do Node.js.

## Configuração e Instalação

A maneira recomendada de configurar e executar o projeto é usando Docker Compose.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/youknowhooo-66/cleaning_schedule.git
    cd cleaning_schedule/back
    ```

2.  **Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do diretório `back` (ou copie e renomeie `.env.test`) e configure as variáveis de ambiente necessárias. Um exemplo mínimo:
    ```env
    DATABASE_URL="postgresql://user:password@db:5432/hotel_schedule_db?schema=public"
    JWT_SECRET="your_jwt_secret_key"
    PORT=3000
    ```
    **Nota:** As credenciais do banco de dados no `docker-compose.yml` (`user`, `password`, `hotel_schedule_db`) devem corresponder às definidas no seu `.env` ou ser consistentes se você optar por usar apenas as do `docker-compose.yml`.

3.  **Construa e Inicie os Serviços com Docker Compose:**
    ```bash
    docker compose up --build -d
    ```
    Este comando irá:
    *   Construir as imagens Docker para o backend.
    *   Iniciar um contêiner PostgreSQL.
    *   Iniciar o contêiner do backend, aplicar as migrações do Prisma e iniciar o servidor Node.js.

## Executando a Aplicação (Desenvolvimento Local - Opcional)

Se você preferir executar a aplicação sem Docker para o backend (mantendo o banco de dados em Docker):

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Configure o `.env`:**
    Certifique-se de que `DATABASE_URL` no seu `.env` aponte para o serviço de banco de dados do Docker Compose: `postgresql://user:password@localhost:5432/hotel_schedule_db?schema=public`

3.  **Execute as Migrações do Prisma:**
    ```bash
    npx prisma migrate deploy
    # Ou para desenvolvimento:
    # npx prisma migrate dev --name init
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:3000`.

## Gerenciamento do Banco de Dados com Prisma

O projeto utiliza o Prisma para gerenciamento do banco de dados.

*   **Aplicar Migrações:**
    As migrações são aplicadas automaticamente ao iniciar o serviço `backend` via `docker compose up`. Para aplicar migrações manualmente (após criar novas):
    ```bash
    npx prisma migrate deploy
    ```
*   **Gerar um novo Client Prisma:**
    Se você alterar o `schema.prisma` ou precisar regenerar o cliente:
    ```bash
    npx prisma generate
    ```
*   **Seed do Banco de Dados:**
    Para popular o banco de dados com dados iniciais (se houver um script `prisma/seed.js`):
    ```bash
    npx prisma db seed
    ```

## Testes

Os testes unitários e de integração são escritos com Jest.

Para executar os testes:
```bash
npm test
```

## Estrutura da API

A API é organizada por recursos, com controladores e rotas dedicados.
Os principais recursos incluem:

*   `/api/users`: Gerenciamento de usuários.
*   `/api/rooms`: Gerenciamento de quartos.
*   `/api/bookings`: Gerenciamento de reservas.
*   `/api/pricing`: Regras de precificação.
*   `/api/audit-logs`: Logs de auditoria.

**Nota:** A documentação detalhada dos endpoints (Swagger/OpenAPI) não está incluída neste README, mas pode ser implementada em uma fase posterior.

## Contribuindo

Contribuições são bem-vindas! Por favor, siga as diretrizes abaixo:

1.  Faça um fork do repositório.
2.  Crie uma nova branch (`git checkout -b feature/sua-feature`).
3.  Faça suas alterações e garanta que os testes passem.
4.  Commit suas mudanças (`git commit -am 'feat: Adiciona nova feature X'`).
5.  Envie para a branch original (`git push origin feature/sua-feature`).
6.  Abra um Pull Request detalhado.

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

## Contato

Para dúvidas ou suporte, entre em contato com Maycon Gibson.
