# obs-websocket

## Overview
This project integrates OBS Studio with a custom frontend and backend using WebSocket communication.

## Prerequisites
- Node.js installed (version 14 or higher recommended)
- npm installed

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd obs-plugin
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
Run the following command to start both the frontend and backend:
```bash
npm run dev:full
```

## Usage

### Preview Image
<img src="https://i.ibb.co/fV6W6SYn/Screenshot-2025-08-17-192645.png" alt="Preview Image" width="600" height="400" style="border: 1px solid #000;">

### Frontend
- The frontend is accessible at `http://localhost:3000`.
- Use the admin panel to manage alerts and preview features.

### Backend
- The backend communicates with OBS Studio via WebSocket.
- Ensure OBS Studio is running and the WebSocket server is enabled before starting the backend.

## Troubleshooting

- **OBS Connection Issues:**
  - Ensure OBS Studio is running.
  - Verify WebSocket server is enabled in OBS.
  - Check that the WebSocket password matches the one in the `.env` file.

- **Dependency Issues:**
  - Ensure all dependencies are installed by running `npm install`.

- **Port Conflicts:**
  - Check if the default port is in use and update the `.env` file to use a different port.

- **Firewall Issues:**
  - Ensure the WebSocket port is not blocked by your firewall.
