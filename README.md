# 🏨 Hotel Schedule - Gestão Hoteleira Profissional

O **Hotel Schedule** é uma plataforma fullstack projetada para a gestão moderna de hotéis e pousadas. O sistema integra desde o controle operacional de quartos até a inteligência de precificação e auditoria completa de ações.

![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Prisma-blue)
![Localização](https://img.shields.io/badge/Idioma-Portugu%C3%AAs%20(pt--BR)-green)

---

## 🎯 Funcionalidades de Negócio

### 1. Gestão de Reservas e Disponibilidade
*   **Ciclo de Vida:** Controle total desde a reserva pendente até o check-out.
*   **Prevenção de Conflitos:** Algoritmo robusto que impede sobreposição de reservas no mesmo quarto.
*   **Alertas Inteligentes:** Notificações automáticas quando a ocupação atinge limites críticos ou risco de overbooking.

### 2. Gestão de Quartos e Categorias
*   **Categorização:** Suporte a quartos Simples, Duplo e Suítes.
*   **Status Operacional:** Monitoramento em tempo real (Disponível, Ocupado, Manutenção).

### 3. Precificação Dinâmica
*   **Regras Customizadas:** Ajuste de preços por temporada, feriados ou demanda.
*   **Maximização de Receita:** Aplicação inteligente de multiplicadores e preços fixos.

### 4. Auditoria e Rastreabilidade
*   **Audit Log:** Registro de todas as operações (quem, quando e o que foi alterado).
*   **Dashboard:** Visão consolidada de reservas, ocupação e receita total.

---

## 🛠️ Infraestrutura e Tecnologia

*   **Frontend:** React.js (Vite) com Tailwind CSS e Lucide Icons.
*   **Backend:** Node.js (Express) com arquitetura RESTful.
*   **Banco de Dados:** PostgreSQL utilizando Prisma ORM.
*   **Segurança:** Autenticação JWT e criptografia de senhas com Bcrypt.
*   **DevOps:** Conteinerização total com Docker e Docker Compose.
*   **Qualidade:** Suíte de testes automatizados com Jest e Supertest.

---

## ⚙️ Como Executar

### Backend
```bash
cd back
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd front
npm install
npm run dev
```

---

## 📂 Requisitos Detalhados
Para mais informações sobre as especificações técnicas e de negócio, consulte:
- [Requisitos de Infraestrutura](./LISTA%20DE%20REQUESITOS%20DE%20INFRAESTRUTURA.txt)
- [Requisitos de Hotelaria](./LISTA%20DE%20REQUESITOS%20HOTELARIA.txt)
