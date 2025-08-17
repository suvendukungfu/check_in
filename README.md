# Event Check-in System - React + Supabase

A complete event registration and check-in system with QR code functionality built with React.js, Vite, and Supabase.

## Features

- Attendee registration with name, email, gender, year, and batch
- QR code ticket generation and download
- Check-in scanning via webcam with continuous scanning
- Audio feedback for successful/failed check-ins
- Admin panel with real-time statistics
- Supabase database for storing attendee information
- Cloud-based data storage and real-time updates

## Project Structure

- **React Frontend**: Modern React application with Vite build tool
- **Supabase Backend**: Cloud database with real-time capabilities
- **QR Code System**: Generation and scanning functionality

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account and project

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

#### Setup Environment Variables

1. Create a `.env` file in the root directory
2. Add your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Start Development Server

```bash
npm run dev
```

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
- **Backend**: Supabase (PostgreSQL, Real-time, Auth)
- **QR Codes**: QRCode library for generation, ZXing for scanning
- **Audio**: Web Speech API for voice feedback

## Database Schema

The Supabase database includes:

- **attendees** table with fields: id, name, email, gender, year, batch, token, checked_in, registered_at
- Row Level Security policies for public access
- Indexes for optimal performance

## Development Notes

- All data is stored in Supabase cloud database
- Camera permissions are required for QR code scanning
- QR codes contain tokens that link to check-in URLs
- Real-time updates available through Supabase subscriptions

## Deployment

This project is ready for deployment on platforms like Vercel, Netlify, or any static hosting service. Make sure to set your environment variables in your deployment platform.