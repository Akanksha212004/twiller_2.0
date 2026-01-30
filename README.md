# Twiller 2.0 - Twitter Clone Application

Twiller 2.0 is a full-stack social media application designed to replicate the core functionalities of Twitter. This project focuses on providing a seamless user experience with modern web technologies.

## Features
- User Authentication: Secure registration and login system.
- Tweet Management: Capability for users to create, view, and manage tweets.
- Audio Integration: Support for voice-based features using Twilio API.
- Multilingual Support: Integration of multiple languages including Hindi, English, and French.
- Responsive Design: Optimized for various screen sizes using Tailwind CSS.
- Real-time Notifications: Powered by Firebase for instant updates.

## Technical Stack
- Frontend: Next.js, Tailwind CSS, Shadcn UI
- Backend: Node.js, Express.js
- Database: MongoDB
- Third-Party APIs: Firebase (Real-time data)

## Installation and Setup

1. Clone the repository:
   git clone https://github.com/Akanksha212004/twiller_2.0.git

2. Install backend dependencies:
   cd backend
   npm install

3. Install frontend dependencies:
   cd ../twiller
   npm install

4. Configure Environment Variables:
   Create a .env file in the backend directory. Refer to .env.example for the required keys (e.g., MongoDB credentials).

5. Launch the application:
   # Start Backend (from backend folder)
   npm start
   
   # Start Frontend (from twiller folder)
   npm run dev

## Folder Structure
- /backend: Contains Express server, MongoDB models, and API routes.
- /twiller: Contains Next.js frontend, components, and global styles.