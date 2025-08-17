# Backend Setup and Usage Guide

## Prerequisites
- Node.js installed (version 14 or higher recommended)
- npm installed

## Setup Instructions

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure Env:
   - Environment Variables:
   ```bash
   PORT=
   OBS_PASSWORD=""
   OBS_HOST=
   OBS_PORT=
   ```
4. Start server:
```bash
using start with frontend
```

## Usage

- The backend server listens for connections and communicates with OBS Studio via WebSocket.
- Ensure OBS Studio is running and the WebSocket server is enabled before starting the backend.
- Access the admin panel to test and manage alerts.

## Testing

1. Start the backend server:
```bash
npm start
```

2. Check the console for the "Connected to OBS" message.

3. Visit the admin panel in your browser to test alerts.

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
