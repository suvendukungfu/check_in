# Event Check-in System - React Version

A complete event registration and check-in system with QR code functionality built with React.js and Vite.

## Features

- Attendee registration with name, email, gender, year, and batch
- QR code ticket generation and download
- Check-in scanning via webcam with continuous scanning
- Audio feedback for successful/failed check-ins
- Admin panel with real-time statistics
- SQLite database for storing attendee information
- Express.js backend server

## Project Structure

- **React Frontend**: Modern React application with Vite build tool
- **Express Backend**: Standalone server with SQLite database
- **QR Code System**: Generation and scanning functionality

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

#### Running Both Servers (Recommended)

```bash
npm run start-all
```

This will start both the Express server (port 4000) and React dev server (port 3000)

#### Running Servers Separately

**Express Server:**
```bash
npm run server
```

**React Development Server:**
```bash
npm run dev
```

**Note:** Both servers must be running for the application to work properly.

## Usage

1. **Registration**:
   - Visit http://localhost:3000
   - Click "Go to Registration"
   - Fill in all required fields (name, email, gender, year, batch)
   - Download your QR code ticket automatically

2. **Check-in**:
   - Visit http://localhost:3000/checkin
   - Click "Start Scanning" to enable camera
   - Scan attendee QR codes (supports continuous scanning)
   - Receive audio and visual confirmation

3. **Administration**:
   - Visit http://localhost:3000/admin
   - View all registered attendees
   - See real-time check-in statistics
   - Refresh data as needed

## Technologies Used

- **Frontend**: React.js, TypeScript, Vite, React Router, Tailwind CSS
- **Backend**: Express.js, SQLite3, CORS
- **QR Codes**: QRCode library for generation, ZXing for scanning
- **Audio**: Web Speech API for voice feedback

## API Endpoints

The React app communicates with the Express server through these endpoints:

- `POST /api/register` - Register new attendee
- `POST /api/checkin` - Check in attendee
- `GET /api/attendees` - Get all attendees (admin)

## Development Notes

- The Vite dev server proxies API calls to the Express server
- Camera permissions are required for QR code scanning
- QR codes contain tokens that link to check-in URLs
- SQLite database runs in-memory for development