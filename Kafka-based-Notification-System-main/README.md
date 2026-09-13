# 🚀 Kafka-Based Real-Time Notification & Messaging System

A modern, full-stack, enterprise-grade notification and messaging platform powered by **Spring Boot**, **Apache Kafka**, **PostgreSQL**, **Redis**, and a responsive **React (TypeScript + Tailwind CSS)** frontend with Progressive Web App (PWA) support.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone Repository](#1-clone-the-repository)
  - [2. Infrastructure with Docker Compose](#2-start-infrastructure-with-docker-compose)
  - [3. Backend Configuration & Startup](#3-configure-and-run-backend)
  - [4. Frontend Setup & Run](#4-setup-and-run-frontend)
- [Environment Variables Reference](#-environment-variables-reference)
- [API Documentation](#-api-documentation)
- [License](#-license)

---

## 🌟 Overview

The **Kafka-Based Notification System** delivers decoupled, highly scalable, and asynchronous message delivery across multi-tenant organizations. Whether broadcasting announcements, coordinating employee channels, sending email notifications, or managing invitations, events are reliably streamed and queued through Apache Kafka topics and cached via Redis for ultra-low latency access.

---

## 🏛 System Architecture

```
   ┌──────────────────┐               ┌──────────────────┐
   │ React Frontend   │ ──(HTTP/REST)─▶│   Spring Boot    │
   │ (TypeScript/PWA) │               │     Backend      │
   └──────────────────┘               └─────────┬────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 ▼                              ▼                              ▼
        ┌─────────────────┐            ┌─────────────────┐            ┌─────────────────┐
        │  PostgreSQL 16  │            │   Redis Cache   │            │  Apache Kafka   │
        │  (Persistence)  │            │ & Rate Limiting │            │ (Event Broker)  │
        └─────────────────┘            └─────────────────┘            └────────┬────────┘
                                                                               │
                                                                               ▼
                                                                      ┌─────────────────┐
                                                                      │  Kafka Consumer │
                                                                      │ (Email / Push)  │
                                                                      └─────────────────┘
```

---

## ✨ Key Features

- **⚡ Event-Driven Decoupled Messaging**: Utilizes Apache Kafka for durable, high-throughput event streaming and message notification processing.
- **🏢 Multi-Tenant Organizations & Channels**: Create and manage organizations, company-wide announcement channels, and member permissions.
- **🔒 Enterprise Security & JWT Auth**: Role-based access control, OTP verification, secure password resets, and stateless JWT authorization.
- **⚡ Redis Caching & In-Memory Store**: Accelerated queries, session tracking, token blacklisting, and rate limiting.
- **📧 Email Notification Pipeline**: Asynchronous background dispatch with Brevo API integration.
- **🖼 Cloudinary Media Integration**: Seamless image uploads, compression, and delivery for media attachments and avatars.
- **📱 Progressive Web App (PWA)**: Offline indicator, service workers, and mobile-friendly responsive UI.
- **📊 Interactive Analytics Engine**: Advanced real-time stream aggregation, sliding window counters, and telemetry metrics.

---

## 🛠 Tech Stack

### Backend
- **Java 17+**
- **Spring Boot 3.x / 4.x** (Spring Web, Spring Security, Spring Data JPA, Spring Kafka, Spring Data Redis)
- **Apache Kafka 7.6 (KRaft mode)**
- **PostgreSQL 16**
- **Redis 7**
- **Cloudinary SDK**
- **Brevo API Client**
- **OpenAPI / Swagger (springdoc-openapi)**

### Frontend
- **React 18** + **TypeScript**
- **Vite**
- **Tailwind CSS** + **Tailwind Merge**
- **Lucide Icons**
- **Axios**
- **Canvas Confetti**

---

## 📂 Project Structure

```
Kafka-based-Notification-System/
├── Backend/
│   ├── docker-compose.yml           # Multi-container setup (Postgres, Redis, Kafka, Kafka-UI)
│   ├── Dockerfile                   # Backend Docker containerization
│   ├── pom.xml                      # Maven dependencies and configuration
│   └── src/
│       ├── main/
│       │   ├── java/com/testing/springpractice/messagingsystem/
│       │   │   ├── Configurations/  # Security, Redis, Cloudinary, CORS configs
│       │   │   ├── Controllers/     # REST API endpoints (Auth, Company, Messages, etc.)
│       │   │   ├── DataTransferObjects/ # Request and response DTO schemas
│       │   │   ├── Models/          # JPA entity models
│       │   │   ├── Repository/      # Spring Data repositories
│       │   │   ├── Service/         # Service layer interfaces
│       │   │   ├── ServiceImplementations/ # Kafka producers/consumers, email, business logic
│       │   │   └── Utils/           # Analytics engines, JWT utils, helper functions
│       │   └── resources/
│       │       └── application.properties
│       └── test/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── public/                      # Static icons, manifest, service worker
│   └── src/
│       ├── api/                     # Axios API service clients
│       ├── components/              # Modular UI components (modals, layout, nav, PWA)
│       ├── context/                 # Auth, Theme, Company, Toast contexts
│       ├── pages/                   # Application views (Inbox, Sent, Channels, Members, Auth)
│       └── types/                   # TypeScript interfaces and types
├── .gitattributes                   # Linguist overrides
├── .gitignore                       # Repository ignore rules
└── README.md                        # Documentation
```

---

## 📋 Prerequisites

Ensure you have the following installed on your local machine:
- **Git**
- **Docker & Docker Compose**
- **Java Development Kit (JDK 17 or higher)**
- **Node.js (v18 or higher)** & **npm**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hnpsbindra-singh/Kafka-based-Notification-System.git
cd Kafka-based-Notification-System
```

### 2. Start Infrastructure with Docker Compose

Launch PostgreSQL, Redis, Kafka, and Kafka-UI with a single command:

```bash
cd Backend
docker compose up -d
```

Verify services:
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **Kafka Broker**: `localhost:9092`
- **Kafka UI**: `http://localhost:8085` (web dashboard to inspect topics and messages)

### 3. Configure and Run Backend

Set the required environment variables (or supply them in an `.env` file / IDE run configuration):

```bash
# Example environment settings (PowerShell)
$env:PORT="8080"
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/companyconnect"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="postgrespassword"
$env:REDIS_HOST="localhost"
$env:REDIS_PORT="6379"
$env:REDIS_PASSWORD=""
$env:REDIS_SSL_ENABLED="false"
$env:KAFKA_BOOTSTRAP_SERVERS="localhost:9092"
$env:JWT_SECRET="your-256-bit-secret-key-must-be-long-and-secure"
$env:CLOUDINARY_CLOUD_NAME="your-cloud-name"
$env:CLOUDINARY_API_KEY="your-api-key"
$env:CLOUDINARY_API_SECRET="your-api-secret"
$env:BREVO_API_KEY="your-brevo-api-key"
$env:BREVO_SENDER_EMAIL="notifications@yourdomain.com"

# Run the Spring Boot application
./mvnw spring-boot:run
```

The backend server will start on `http://localhost:8080`.

### 4. Setup and Run Frontend

Open a new terminal and navigate to `frontend`:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` to access the web application!

---

## ⚙️ Environment Variables Reference

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Backend HTTP listening port | `8080` |
| `SPRING_DATASOURCE_URL` | JDBC URL for PostgreSQL | `jdbc:postgresql://localhost:5432/companyconnect` |
| `SPRING_DATASOURCE_USERNAME`| PostgreSQL user | `postgres` |
| `SPRING_DATASOURCE_PASSWORD`| PostgreSQL password | `postgrespassword` |
| `REDIS_HOST` | Host address for Redis | `localhost` |
| `REDIS_PORT` | Port for Redis | `6379` |
| `REDIS_PASSWORD` | Redis password (if enabled) | `""` |
| `REDIS_SSL_ENABLED` | Enable SSL for Redis connections | `false` |
| `KAFKA_BOOTSTRAP_SERVERS` | Kafka bootstrap address | `localhost:9092` |
| `JWT_SECRET` | Secret key used to sign JWT tokens | `<base64-or-hex-secret>` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier | `<cloud_name>` |
| `CLOUDINARY_API_KEY` | Cloudinary API access key | `<api_key>` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `<api_secret>` |
| `BREVO_API_KEY` | Brevo email service API key | `<brevo_api_key>` |
| `BREVO_SENDER_EMAIL` | Originating email sender | `no-reply@app.com` |

---

## 📖 API Documentation

Once the backend is running, Swagger UI and OpenAPI specifications are available at:
- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

---

## 📄 License

This project is licensed under the MIT License.
