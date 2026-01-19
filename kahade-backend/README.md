# Kahade Backend API

🚀 **Kahade** is a secure P2P escrow platform built with NestJS, Prisma, PostgreSQL, and blockchain integration.

## 🌟 Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens
- **User Management**: Complete user CRUD with role-based access control
- **Escrow Transactions**: Secure P2P transaction management with multiple statuses
- **Dispute Resolution**: Built-in dispute management system
- **Blockchain Integration**: Transaction recording on blockchain for transparency
- **Payment Gateway**: Integration with payment gateways (Midtrans, Xendit compatible)
- **Real-time Notifications**: User notification system
- **Email Service**: Automated email notifications
- **Caching**: Redis caching for improved performance
- **Queue Management**: Bull queue for background jobs
- **API Documentation**: Auto-generated Swagger documentation
- **Testing**: Jest testing framework setup

## 🛠️ Tech Stack

- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **Database**: PostgreSQL 16 with Prisma ORM
- **Cache**: Redis 7
- **Queue**: Bull (Redis-based)
- **Blockchain**: Web3.js / Ethers.js
- **Authentication**: Passport JWT
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Email**: Nodemailer

## 📋 Prerequisites

- Node.js 20 or higher
- PostgreSQL 16
- Redis 7
- Yarn or npm
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/rekberkan/kahade.git
cd kahade/kahade-backend
```

### 2. Install dependencies

```bash
yarn install
# or
npm install
```

### 3. Environment setup

```bash
cp .env.example .env.development
```

Edit `.env.development` with your configuration:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/kahade_dev
JWT_SECRET=your-super-secret-key
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Database setup

```bash
# Generate Prisma Client
yarn prisma:generate

# Run migrations
yarn prisma:migrate

# Seed database
yarn prisma:seed
```

### 5. Run the application

```bash
# Development mode
yarn start:dev

# Production mode
yarn build
yarn start:prod
```

The API will be available at `http://localhost:3000`

Swagger documentation: `http://localhost:3000/api/v1/docs`

## 🐳 Docker Setup

### Development

```bash
cd docker
docker-compose up -d
```

### Production

```bash
cd docker
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Project Structure

```
kahade-backend/
├── prisma/
│   ├── schemas/          # Modular Prisma schemas
│   ├── migrations/       # Database migrations
│   └── seed.ts          # Database seeding
├── src/
│   ├── api/             # API versioning
│   ├── common/          # Shared utilities
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── middleware/
│   │   ├── pipes/
│   │   └── utils/
│   ├── config/          # Configuration modules
│   ├── core/            # Business logic
│   │   ├── auth/
│   │   ├── user/
│   │   ├── transaction/
│   │   ├── dispute/
│   │   └── notification/
│   ├── infrastructure/  # External services
│   │   ├── database/
│   │   ├── cache/
│   │   ├── queue/
│   │   └── storage/
│   ├── integrations/    # Third-party integrations
│   │   ├── blockchain/
│   │   ├── payment/
│   │   └── email/
│   ├── security/        # Security utilities
│   ├── app.module.ts
│   └── main.ts
├── test/                # E2E tests
├── docker/              # Docker configuration
└── docs/                # Additional documentation
```

## 🔐 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Users

- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update profile
- `GET /api/v1/users/:id` - Get user by ID

### Transactions

- `POST /api/v1/transactions` - Create transaction
- `GET /api/v1/transactions` - Get all transactions
- `GET /api/v1/transactions/:id` - Get transaction details
- `PUT /api/v1/transactions/:id/status` - Update transaction status
- `POST /api/v1/transactions/:id/confirm-payment` - Confirm payment
- `POST /api/v1/transactions/:id/release-funds` - Release funds
- `POST /api/v1/transactions/:id/cancel` - Cancel transaction

### Disputes

- `POST /api/v1/disputes` - Create dispute
- `GET /api/v1/disputes` - Get all disputes (Admin)
- `GET /api/v1/disputes/:id` - Get dispute details
- `PUT /api/v1/disputes/:id/resolve` - Resolve dispute (Admin)

### Notifications

- `GET /api/v1/notifications` - Get all notifications
- `PUT /api/v1/notifications/:id/read` - Mark as read
- `PUT /api/v1/notifications/read-all` - Mark all as read

## 🧪 Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## 📝 Scripts

```bash
yarn start:dev       # Start development server
yarn start:prod      # Start production server
yarn build           # Build for production
yarn lint            # Run ESLint
yarn format          # Format with Prettier
yarn prisma:generate # Generate Prisma Client
yarn prisma:migrate  # Run database migrations
yarn prisma:studio   # Open Prisma Studio
yarn prisma:seed     # Seed database
```

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- SQL injection prevention (Prisma)
- XSS protection

## 🌐 Deployment

See [deployment documentation](./docs/DEPLOYMENT.md) for detailed deployment instructions.

## 📄 License

MIT License

## 👥 Authors

**Rekberkan Team**

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📞 Support

For support, email support@kahade.com or join our Slack channel.

---

**Made with ❤️ by Rekberkan Team**
