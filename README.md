# 📢 Kafka-Based Notification System

A full-stack notification and messaging platform built using **Spring Boot, Apache Kafka, React, TypeScript, PostgreSQL, Redis, and Docker**.

The system is designed to handle real-time notifications, messaging, user authentication, analytics, and scalable event-driven communication.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Secure API access
- Role-based access control
- Protected frontend routes

### 📩 Notification Management
- Create and manage notifications
- Event-driven notification processing
- Kafka-based asynchronous communication
- Notification status tracking
- Scalable message delivery

### 💬 Messaging System
- Send and receive messages
- Kafka-powered message processing
- Real-time communication support
- Message history management

### 📊 Analytics
- Notification and messaging analytics
- Activity tracking
- Data visualization
- User engagement insights

### ☁️ Cloud Integration
- Cloudinary integration for media handling
- Support for uploading and managing media files

### ⚡ Performance & Caching
- Redis integration
- Faster data access
- Efficient message and notification processing

### 📱 Progressive Web App
- Responsive user interface
- PWA support
- Mobile-friendly design

### 📚 API Documentation
- Swagger/OpenAPI integration
- Easy API testing and exploration

### 🐳 Docker Support
- Docker Compose configuration
- Easy setup of required services
- Containerized development environment

---

## 🛠️ Tech Stack

### Backend
- Java
- Spring Boot
- Spring Security
- Apache Kafka
- PostgreSQL
- Redis
- Maven
- Swagger/OpenAPI

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- Vite

### Tools & Services
- Docker
- Docker Compose
- Cloudinary
- Brevo Email Service
- JWT

---

## 🏗️ System Architecture

The application follows an event-driven architecture.

1. The user performs an action through the frontend.
2. The backend validates and processes the request.
3. An event is published to Apache Kafka.
4. Kafka consumers process the event.
5. Notifications or messages are delivered through the required service.
6. PostgreSQL stores persistent data.
7. Redis is used for caching and performance optimization.

---

## 📁 Project Structure

```text
Kafka-based-Notification-System/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── docker-compose.yml
├── README.md
└── ...
