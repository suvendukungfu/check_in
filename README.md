# Event Check-in System

A complete event registration and check-in system with QR code functionality. This project includes both a standalone Express server and a Next.js application.

## Features

- Attendee registration with name and email
- QR code ticket generation
- Check-in scanning via webcam
- Audio feedback for successful/failed check-ins
- SQLite database for storing attendee information

## Project Structure

- **Express Server**: Standalone server with in-memory SQLite database
- **Next.js App**: Modern React application with server-side rendering

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

This will start both the Express server (port 4000) and Next.js app (port 3000)

#### Running Servers Separately

**Express Server:**
```bash
npm run server
```

**Next.js Application:**

```bash
npm run dev
```

**Note:** Both servers must be running for the application to work properly.

## Usage

1. **Registration**:
   - Visit the registration page at http://localhost:3000
   - Fill in name and email
   - Receive a QR code ticket

2. **Check-in**:
   - Visit the check-in page at http://localhost:3000/checkin
   - Scan attendee QR codes
   - Receive audio and visual confirmation

3. **Administration**:
   - Visit the admin panel at http://localhost:3000/admin
   - View all registered attendees and check-in statistics

## Technologies Used

- Next.js for the frontend and API routes
- Express for the standalone server
- SQLite for database storage
- QRCode for generating QR codes
- ZXing for scanning QR codes
- Tailwind CSS for styling