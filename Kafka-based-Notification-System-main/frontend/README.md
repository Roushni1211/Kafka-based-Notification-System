# CompanyConnect - Google-Themed Progressive Web App (PWA)

A Progressive Web App (PWA) frontend designed in the **Google Workspace / Material You (Material Design 3)** aesthetic for the CompanyConnect Enterprise Messaging System backend.

---

## 🌟 Key Highlights & Features

### 1. 🎨 Google Workspace & Material Design 3 Design System
- **Google 4-Color Accents**: Distinctive Google Blue (`#1a73e8`), Red (`#ea4335`), Yellow (`#fbbc04`), and Green (`#34a853`).
- **Surfaces & Tones**: Dynamic Light Mode and Dark Mode (`#131314` Google dark workspace theme) with smooth transitions.
- **Iconic Google Workspace UI**:
  - **Google Header**: Features company branding, centered search pill with `Ctrl+K` shortcut, Dark/Light theme toggle, 3x3 App Launcher ("Waffle" menu), and Google Account profile card popup.
  - **Left Navigation Sidebar**: Collapsible with pill active indicators, space switcher dropdown, and Google One quota widget.
  - **Google Compose Modal**: Minimizable, expandable to full screen, recipient chip selector with "Select All", subject, content, and Cloudinary attachment upload.
  - **Google Accounts Profile Popup**: Manage profile, workspace credentials, and sign out.

### 2. 📱 Mobile First & Responsive Design
- **Material 3 Bottom Navigation**: Tailored for thumb navigation on iOS & Android devices.
- **Floating Action Button (+ Compose)**: Thumb-accessible FAB in bottom-right corner.
- **Safe Area Insets**: Full support for notches and mobile gesture bars (`env(safe-area-inset-bottom)`).
- **Responsive Modals**: Transform into touch-friendly bottom sheets on mobile devices.

### 3. ⚡ Progressive Web App (PWA)
- **Installable**: Full `manifest.webmanifest` with custom app icons and standalone display mode.
- **Offline Ready**: Custom Service Worker (`sw.js`) with cache-first static assets and network-first API strategies.
- **Connection Status**: Google Docs-style "Working offline" / "Back online" pill badge.
- **Native Install Prompt**: Floating banner allowing 1-click home screen installation.

### 4. 🔗 Complete Backend Integration
Supports all Spring Boot REST API controllers:
- **Authentication**: Sign in, registration, 6-digit OTP email verification, password reset, and user profile updating.
- **Company Spaces**: Create company spaces with logo image upload (Cloudinary multipart), join spaces via Join Code, list owned/all companies, inspect space details.
- **Teams & Employees**: List space members, invite colleagues via email (Kafka event trigger), remove members (space leaders).
- **Invitations**: View pending organization invites, 1-click accept.
- **Messaging**: Inbox, sent history, live space broadcast channel, detailed message reading, and multipart compose with Cloudinary attachments.

### 5. 🧪 Dual Operation: Live Backend + Interactive Demo Mode
- **Live API Mode**: Communicates directly with Spring Boot backend at `http://localhost:8080/api` with JWT authentication.
- **Demo / Mock Mode**: One-click toggle in the header allowing immediate exploration of all features, companies, channels, and messages even if local Docker/Postgres/Kafka/Redis containers are stopped!

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Running Frontend in Development Mode
```bash
cd frontend
npm install
npm run dev
```
The app will be live at: **http://localhost:5173**
*(API calls to `/api` are automatically proxied to Spring Boot at `http://localhost:8080`)*

### Building for Production & Bundling into Spring Boot
To compile the TypeScript code and bundle the frontend directly into Spring Boot's `src/main/resources/static` directory:
```bash
npm run build:spring
```
Once synced, running the Spring Boot application will serve the entire frontend automatically at **http://localhost:8080**!

---

## 🛠 Tech Stack
- **React 18** with **TypeScript**
- **Vite** for rapid bundling
- **Tailwind CSS** with custom Google Material 3 tokens
- **Lucide React** for clean Google-style iconography
- **Axios** with JWT request interceptors and multipart support
- **Canvas Confetti** for celebratory user interactions
