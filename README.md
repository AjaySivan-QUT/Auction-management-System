# Auction Management App

A comprehensive web-based auction management system that enables users to create, manage, and participate in online auctions with secure authentication.

## Table of Contents

- [Features]
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
## Features

### Core Functionality
- **User Management**
  - User registration and authentication
  - Secure login/logout with session management
  - Profile information updates

- **Auction Management**
  - Create new auctions with detailed descriptions
  - View active auctions
  - Update auction details
  - Delete auctions

- **Security & Authentication**
  - Secure user authentication system
  - Session-based user management
  - Protected routes and authorization
  - User session termination

### Non-Functional Features
- Responsive web design
- Scalable architecture
- Performance optimized
- Mobile-friendly interface

## 🛠 Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js / Express.js
- **Database**: MongoDB
- **Authentication**: JWT / Session-based
- **Styling**: CSS3
- **Version Control**: Git
- **Project Management**: Jira

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Database** (MongoDB or PostgreSQL)

## 🚀 Installation

1. **Clone the repository**
   ```bash
  'https://github.com/AjaySivan-QUT/Auction-management-System.git'
   ```

2. **Install dependencies**
   ```bash
   # For frontend
   cd frontend
   npm install
   npm start

   # For backend (if separate)
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cd .env
   ```
   Edit the `.env` file with your configuration values.

1. **Start the development server**
   ```bash
   cd backend
   npm start
   ```

2. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001/api` (if separate)

