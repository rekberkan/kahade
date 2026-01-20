# Kahade Backend

## Overview

Kahade is a secure P2P (peer-to-peer) escrow platform backend built with NestJS. The platform facilitates secure transactions between buyers and sellers by holding funds in escrow until both parties are satisfied. The system includes blockchain integration for transaction transparency, payment gateway support (Midtrans, Xendit), dispute resolution, and real-time notifications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Framework & Language
- **NestJS 10** with **TypeScript 5** - Modular architecture following NestJS best practices with clear separation of concerns
- Uses decorators, dependency injection, and module-based organization

### Core Modules Structure
The application follows a layered architecture:

1. **Core Layer** (`src/core/`) - Business logic modules
   - `auth/` - JWT-based authentication with refresh tokens
   - `user/` - User management with role-based access control (USER, ADMIN, MODERATOR)
   - `transaction/` - Escrow transaction management with status workflow
   - `dispute/` - Dispute resolution system
   - `notification/` - User notification system

2. **Infrastructure Layer** (`src/infrastructure/`)
   - `database/` - Prisma ORM service for PostgreSQL
   - `cache/` - Redis caching service
   - `queue/` - Bull queue for background jobs
   - `storage/` - File storage management

3. **Integrations Layer** (`src/integrations/`)
   - `blockchain/` - Web3/Ethers.js for transaction recording
   - `payment/` - Payment gateway integration (Midtrans, Xendit compatible)
   - `email/` - Nodemailer for email notifications

4. **Jobs Layer** (`src/jobs/`) - Background job processors
   - Email processor
   - Notification processor
   - Blockchain transaction processor

### Database
- **PostgreSQL 16** with **Prisma ORM**
- Schema defined in `prisma/schema.prisma`
- Migrations managed via Prisma migrate
- Seed data in `prisma/seed.ts` and `prisma/seed-data/`

### Caching & Queues
- **Redis 7** for caching and session management
- **Bull** for background job queues (email, notification, blockchain)
- Queue names: `email`, `notification`, `blockchain`, `payment`

### Authentication & Security
- JWT authentication with access and refresh tokens
- Passport.js strategies (JWT, Local)
- Role-based access control with custom decorators (`@Roles()`, `@Public()`)
- Guards: `JwtAuthGuard`, `RolesGuard`
- Rate limiting via `@nestjs/throttler`
- Helmet for security headers
- CORS with strict production validation

### API Design
- RESTful API with versioning (`/api/v1/`)
- Swagger/OpenAPI documentation at `/api/v1/docs`
- Global validation pipes with class-validator
- Custom exception filters for HTTP and Prisma errors
- Standardized response format with interceptors

### Configuration
- Environment-based configuration via `@nestjs/config`
- Configuration files in `src/config/` for each service
- Strong validation of secrets in production (JWT, database credentials)
- Path aliases configured: `@core/*`, `@common/*`, `@config/*`, `@infrastructure/*`, `@integrations/*`

### Health Checks
- Terminus-based health endpoints at `/health`, `/health/ready`, `/health/live`
- Monitors: database, Redis, memory, disk

### Testing
- Jest for unit and integration tests
- E2E tests in `test/` directory
- Test fixtures and mocks organized by type

### Deployment
- Docker support with multi-stage builds
- PM2 for process management in production
- Nginx reverse proxy configuration
- Monitoring setup with Prometheus/Grafana dashboards

## External Dependencies

### Databases & Storage
- **PostgreSQL 16** - Primary database (required)
- **Redis 7** - Caching and queue backend (optional, controlled by `REDIS_ENABLED` env var)

### Payment Gateways
- **Midtrans** - Indonesian payment gateway integration
- **Xendit** - Alternative payment gateway
- Webhook controllers for payment callbacks

### Blockchain
- **Web3.js / Ethers.js 6** - Ethereum blockchain integration
- Configurable network (default: Sepolia testnet)
- Records transactions for transparency and auditability

### Email
- **Nodemailer** - Email service for notifications
- Configurable SMTP settings (default: Gmail)

### APIs & Services
- **Axios** - HTTP client for external API calls
- Swagger/OpenAPI for API documentation

### Key Environment Variables
```
DATABASE_URL          # PostgreSQL connection string
REDIS_HOST/PORT       # Redis connection
JWT_SECRET            # Access token secret
JWT_REFRESH_SECRET    # Refresh token secret
PAYMENT_GATEWAY_*     # Payment gateway credentials
BLOCKCHAIN_RPC_URL    # Ethereum RPC endpoint
MAIL_*                # SMTP configuration
```