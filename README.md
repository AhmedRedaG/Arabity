# Arabity

**A comprehensive backend platform for on-demand car maintenance and repair services**

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Version](https://img.shields.io/badge/Version-1.0.1-blue?style=flat-square)
[![Status](https://img.shields.io/badge/status-beta-orange?style=flat-square)]()

</div>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Status](#project-status)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Documentation](#api-documentation)
- [Architecture Overview](#architecture-overview)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Credits & Acknowledgements](#credits--acknowledgements)

---

## Project Overview

**Arabity** is a NestJS-based backend service that powers an on-demand car maintenance and repair marketplace. It provides a complete platform for users to browse available services, book appointments, manage payments, track bookings, and receive real-time notifications.

The platform connects car owners with service providers, handling complex workflows including service management, component tracking, payment processing, booking management, and real-time push notifications.

---

## Project Status

This project is currently under active development and provided as a beta release.

Some areas are still in progress, including:

- Refactoring parts of the codebase
- Completing admin-related endpoints
- Adding documentation and comments for complex logic
- Implementing caching
- Database migrations
- Upgrading the role system to RBAC
- Adding unit and integration tests
- Performance optimizations

Development progress may be slower at times due to ongoing freelance work.
Feedback are welcome and thank you for your understanding.

---

## Features

### Authentication & User Management

- User registration with email verification
- Secure login with JWT-based authentication
- Password reset with OTP verification
- Google OAuth 2.0 integration
- Role-based access control (User, Admin)
- Login attempt tracking and rate limiting
- Multi-tier JWT system (access, verification, reset tokens)

### Service Management

- Browse available car maintenance and repair services
- Component-based service structure with categories
- Service ratings and reviews system
- Component categorization and organization
- Service availability and pricing management

### Booking System

- Create and manage service bookings
- Real-time booking status tracking
- Booking rescheduling (rebook) functionality
- Address and location management with city support
- Booking notifications for users and service providers

### Payment Processing

- Multi-method payment support (Kashier payment gateway)
- Payment status tracking and history
- Secure payment verification and receipt handling
- Transaction management and reporting
- Payment notifications with real-time updates

### Vehicle Management

- Car registration with car types and specifications
- Car component tracking
- Car service history
- Multi-vehicle management per user

### Notifications

- Firebase Cloud Messaging (FCM) for push notifications
- Real-time booking status updates
- Payment status notifications
- Device token management
- Database-backed notification history

### Media Management

- Cloudinary image upload integration
- Multi-image upload support for services and components
- Image validation and optimization
- Support for JPG, JPEG, PNG, WEBP formats

### AI-Powered Features

- Google Gemini AI chat integration
- Real-time streaming responses
- Image analysis capabilities
- Conversational AI for customer support

### Reviews & Ratings

- Comprehensive review system for services
- Rating submissions from users
- Review management (create, update, delete)
- Aggregate rating calculations

### Contact & Support

- Contact form submission
- Support ticketing system
- Message history and tracking

### Admin Features

- Admin dashboard access
- User and booking management
- Payment and transaction oversight
- Service and component administration
- System notifications and alerts

---

## Tech Stack

### Backend Framework

- **NestJS** `^11.1.6` - Progressive Node.js framework for building efficient server-side applications
- **Node.js** `^18.0.0` (assumed minimum)

### Language

- **TypeScript** `^5.9.3` - Typed superset of JavaScript

### Database

- **PostgreSQL** `^8.16.3` - Production-grade relational database
- **TypeORM** `^0.3.27` - ORM for database management
- **typeorm-naming-strategies** `^4.1.0` - Custom naming strategies for database

### Authentication & Security

- **@nestjs/jwt** `^11.0.1` - JWT authentication module
- **@nestjs/config** `^4.0.2` - Configuration management
- **bcrypt** `^6.0.0` - Password hashing and encryption
- **google-auth-library** `^10.5.0` - Google OAuth authentication

### Payment Processing

- **Kashier** Payment Gateway integration

### Cloud & Storage

- **Cloudinary** `^2.8.0` - Cloud image storage and manipulation
- **firebase-admin** `^13.5.0` - Firebase Admin SDK for backend services

### Email Services

- **nodemailer** `^7.0.9` - Email sending
- **sib-api-v3-sdk** `^8.5.0` - Brevo (formerly Sendinblue) email API

### AI Integration

- **@google/genai** `^1.29.0` - Google Gemini AI API

### File Upload

- **multer** `^2.0.2` - Middleware for file upload handling
- **@nestjs/platform-express** `^11.1.6` - Express adapter for NestJS
- **streamifier** `^0.1.1` - Stream conversion utilities

### Data Validation

- **class-validator** `^0.14.2` - Validation decorators
- **class-transformer** `^0.5.1` - Data transformation and serialization

### Templating

- **ejs** `^3.1.10` - Embedded JavaScript templating for email templates

### Utilities

- **rxjs** `^7.8.2` - Reactive programming library
- **reflect-metadata** `^0.2.2` - Runtime metadata reflection

### Development Tools

- **ESLint** `^9.37.0` - Code linting
- **Prettier** `^3.6.2` - Code formatting
- **TypeScript ESLint** `^8.46.1` - TypeScript support for ESLint

---

## API Documentation

You can explore and test the API using the Postman collection:
[Postman Collection](https://www.postman.com/ahmedreda-1513276/workspace/arabity/collection/44840624-5567c636-c0ec-46e8-b460-0b8983d1925f?action=share&creator=44840624&active-environment=44840624-7558973c-3d44-44db-b7a9-081923833351)

---

## Architecture Overview

Arabity follows a modular, service-oriented architecture built on NestJS principles:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                                │
│                 (Web/Mobile Frontends)                                 │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
┌────────────────────────▼───────────────────────────────────┐
│                  NestJS Application                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Authentication Layer                                │ │
│  │  - JWT Token Management  - Google OAuth                          │ │
│  │  - Auth Guards & Pipes   - Role-Based Access                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Core Business Logic Modules                            │ │
│  │  ┌──────────────┬─────────────┬──────────────┐           │ │
│  │  │     Service     │    Booking    │     Payment     │           │ │
│  │  │    Management   │  Management   │    Processing   │           │ │
│  │  └──────────────┴─────────────┴──────────────┘           │ │
│  │  ┌──────────────┬──────────────┬──────────────┐          │ │
│  │  │       User      │     Review     │  Notification   │          │ │
│  │  │    Management   │     System     │  & Messaging    │          │ │
│  │  └──────────────┴──────────────┴──────────────┘          │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          External Service Integration                            │ │
│  │  ┌──────────────┬──────────────┬──────────────┐          │ │
│  │  │   Cloudinary    │     Firebase   │      Google     │          │ │
│  │  │    (Storage)    │  (Messaging)   │    Gemini (AI)  │          │ │
│  │  └──────────────┴──────────────┴──────────────┘          │ │
│  │  ┌──────────────┬──────────────┐                            │ │
│  │  │    Kashier      │     Brevo      │                            │ │
│  │  │   (Payments)    │    (Email)     │                            │ │
│  │  └──────────────┴──────────────┘                            │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬───────────────────────────────────┘
                             │
        ┌────────────────┼────────────────┐
        │                   │                   │
┌─────▼─────────┐  ┌───▼─────────┐  ┌───▼──────────────┐
│    PostgreSQL    │  │     Firebase    │  │    External APIs    │
│     Database     │  │    Messaging    │  │    - Kashier        │
│                  │  │     Servi       │  │    - Cloudinary     │
└───────────────┘  └──────────────┘  │    - Google Auth    │
                                           │    - Gemini AI      │
                                           │    - Brevo          │
                                           └──────────────────┘
```

### Module Organization

The codebase is organized into feature-based modules:

- **auth** - Authentication and login logic
- **user** - User profile and account management
- **service** - Service catalog and management
- **booking** - Booking creation and status management
- **payment** - Payment processing and tracking
- **car** & **car-type** - Vehicle management
- **component** & **component-category** - Service components
- **reviews** - Rating and review system
- **address** & **address-city** - Location management
- **notification** - Database-backed notifications
- **push-notification** - Firebase push notifications
- **firebase-notification** - Firebase integration
- **email** - Email service integration
- **upload** - File upload management
- **cloudinary-upload** - Cloudinary integration
- **gemini-chat** - AI chat functionality
- **google-auth** - Google OAuth integration
- **kashier-payment** - Payment gateway integration
- **contact** - Contact form submissions
- **device-token** - Mobile device token management

---

## Installation & Setup

### Prerequisites

- **Node.js** v18+ (LTS recommended)
- **npm** or **yarn** package manager
- **PostgreSQL** v12+ database
- **Firebase** account with Cloud Messaging enabled
- **Cloudinary** account for image storage
- **Google OAuth 2.0** credentials
- **Kashier** merchant account for payments
- **Brevo** (formerly Sendinblue) account for emails

### Step 1: Clone the Repository

```bash
git clone https://github.com/AhmedRedaG/Arabity.git
cd Arabity
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory with all required variables:

```bash
cp .env.example .env
```

Edit `.env` and populate all required variables (see [Environment Variables](#environment-variables) section).

### Step 4: Database Setup

Ensure PostgreSQL is running and create a database:

```sql
CREATE DATABASE arabity;
```

Update `DATABASE_URL` in `.env` with your PostgreSQL connection string.

TypeORM will automatically synchronize tables on startup (development mode).

### Step 5: Start Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Step 6: Build for Production

```bash
npm run build
```

### Step 7: Run Production Server

```bash
npm run start:prod
```

---

## Configuration

### TypeScript Configuration

- **Target**: ES2020 (ESNext)
- **Module**: NodeNext
- **Strict Mode**: Enabled (`strictNullChecks: true`)
- **Output Directory**: `./dist`

### NestJS Configuration

- **Global Validation Pipe** with whitelist enabled
- **View Engine**: EJS for email templates
- **Base Views Directory**: `./views`

### Database Configuration

Supports dual database configuration:

- **Development**: Uses `db.config.ts`
- **Production**: Uses `db.production.config.ts`
- **Driver**: PostgreSQL with SnakeNamingStrategy

---

## Usage

### Starting the Application

```bash
# Development with hot-reload
npm run start:dev

# Debug mode
npm run start:debug

# Production
npm run start:prod
```

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

### Error Handling

Errors are returned with appropriate HTTP status codes:

```json
{
  "statusCode": 400,
  "message": "Invalid email format",
  "error": "Bad Request"
}
```

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Application

```env
PORT=3000
NODE_ENV=development
```

### Database

```env
DATABASE_URL=postgresql://username:password@localhost:5432/arabity
PRODUCTION_DATABASE_URL=postgresql://username:password@prod-host:5432/arabity
```

### Authentication & JWT

```env
ACCESS_TOKEN_SECRET=your_access_token_secret_key
ACCESS_TOKEN_EXPIRES_IN=24h
VERIFICATION_TOKEN_SECRET=your_verification_token_secret
VERIFICATION_TOKEN_EXPIRES_IN=15m
RESET_TOKEN_SECRET=your_reset_token_secret
RESET_TOKEN_EXPIRES_IN=5m
```

### Email Service (Brevo)

```env
BREVO_API_KEY=your_brevo_api_key
SENDER_MAIL=noreply@arabity.com
SUPPORT_MAIL=support@arabity.com
```

### Google OAuth

```env
GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
```

### Firebase Cloud Messaging

```env
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email@firebase.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=your_firebase_private_key_with_escapes
```

### Payment Processing (Kashier)

```env
KASHIER_MERCHANT_ID=your_kashier_merchant_id
KASHIER_API_KEY=your_kashier_api_key
KASHIER_MODE=test  # or 'production'
```

### Image Storage (Cloudinary)

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### AI Integration (Google Gemini)

```env
GEMINI_API_KEY=your_gemini_api_key
```

### Client Configuration

```env
CLIENT_BASE_URL=http://localhost:8000
API_BASE_URL=https://api.arabity.com  # Production only
```

### Pagination

```env
DEFAULT_PAGE=1
DEFAULT_LIMIT=10
MAX_LIMIT=100
```

### File Upload

```env
MAX_IMAGE_SIZE=5242880  # 5MB in bytes
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,webp
```

---

## Contributing

We welcome contributions! Here's how to get started:

### Code of Conduct

Be respectful, inclusive, and professional in all interactions.

### How to Contribute

1. **Fork the Repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/Arabity.git
   cd Arabity
   ```

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Write clear commit messages
   - Add comments for complex logic
   - Test your changes locally

4. **Format and Lint**

   ```bash
   npm run format
   npm run lint
   ```

5. **Commit and Push**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to GitHub
   - Click "Compare & pull request"
   - Provide a clear title and description
   - Link any related issues
   - Wait for review

### Issue Guidelines

- Search existing issues before creating new ones
- Use clear, descriptive titles
- Include steps to reproduce for bugs
- Suggest specific enhancements with examples

---

## License

This project is licensed under the **MIT** license.

For commercial use, licensing inquiries, or partnerships, please contact the project maintainers.

---

## Credits & Acknowledgements

### Primary Developer

- **Ahmed Reda** - Project Lead and Main Developer

### Key Technologies & Services

- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-Relational Mapping
- **Firebase** - Cloud messaging and authentication
- **Cloudinary** - Image storage and manipulation
- **Google Gemini AI** - AI-powered conversational features
- **Kashier** - Payment gateway integration
- **Brevo (Sendinblue)** - Email service provider
- **PostgreSQL** - Database management

### Open Source Libraries

Thanks to all the incredible open-source contributors and maintainers of the libraries used in this project, including:

- NestJS team and community
- TypeORM contributors
- Express.js community
- All npm package authors

### Support

For questions, issues, or suggestions, please:

- Open an issue on GitHub
- Contact the development team
- Check existing documentation

---

**Built with ❤️ by Ahmed Reda**

Last Updated: December 31, 2025
