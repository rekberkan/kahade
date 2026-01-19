# Frequently Asked Questions (FAQ)

## General

### What is Kahade?

Kahade is a P2P escrow platform that provides secure transactions between buyers and sellers using blockchain technology for transparency.

### What technologies does Kahade use?

Kahade backend is built with:
- NestJS (Node.js framework)
- TypeScript
- PostgreSQL with Prisma ORM
- Redis for caching
- Blockchain (Ethereum/Polygon)
- Payment gateways (Midtrans/Xendit)

## Setup & Installation

### How do I install Kahade locally?

```bash
git clone https://github.com/rekberkan/kahade.git
cd kahade/kahade-backend
yarn install
cp .env.example .env.development
# Edit .env.development with your settings
yarn prisma:generate
yarn prisma:migrate
yarn start:dev
```

### What are the system requirements?

- Node.js 20 or higher
- PostgreSQL 16
- Redis 7
- Docker (optional)

### How do I generate secret keys?

```bash
make generate-secrets
# or
node scripts/generate-secret.js
```

## Database

### How do I create a new migration?

```bash
yarn prisma migrate dev --name your_migration_name
```

### How do I reset the database?

```bash
yarn prisma migrate reset
```

### How do I backup the database?

```bash
make backup
# or
./scripts/backup-db.sh
```

## Development

### How do I run tests?

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# With coverage
yarn test:cov
```

### How do I debug the application?

Use VSCode debugger:
1. Set breakpoints in your code
2. Press F5 or go to Run & Debug
3. Select "Debug NestJS"

### How do I add a new module?

```bash
nest g module feature-name
nest g controller feature-name
nest g service feature-name
```

## API

### Where is the API documentation?

Swagger documentation is available at:
- Development: `http://localhost:3000/api/v1/docs`
- Production: `https://api.kahade.com/api/v1/docs`

### How do I authenticate API requests?

Include the JWT token in the Authorization header:
```
Authorization: Bearer your_access_token
```

### What is the rate limit?

- Short: 3 requests per second
- Medium: 20 requests per 10 seconds
- Long: 100 requests per minute

## Deployment

### How do I deploy to production?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### How do I setup SSL?

```bash
sudo certbot certonly --standalone -d yourdomain.com
```

### How do I monitor the application?

Use PM2 for process monitoring:
```bash
pm2 monit
pm2 logs
```

## Troubleshooting

### Database connection failed

1. Check DATABASE_URL in .env
2. Ensure PostgreSQL is running
3. Test connection: `./scripts/test-db-connection.sh`

### Redis connection failed

1. Check REDIS_HOST and REDIS_PORT
2. Ensure Redis is running
3. Test connection: `./scripts/test-redis-connection.sh`

### Port already in use

Change PORT in .env file or kill the process:
```bash
lsof -ti:3000 | xargs kill -9
```

### Prisma Client not generated

```bash
yarn prisma:generate
```

## Security

### How do I report a security vulnerability?

Email: security@kahade.com

See [SECURITY.md](./SECURITY.md) for details.

### How often should I rotate secrets?

Recommended: Every 90 days for production.

## Performance

### How can I improve API performance?

1. Enable Redis caching
2. Use database indexes
3. Implement pagination
4. Use CDN for static assets
5. Enable compression

### What's the recommended server specs?

Minimum for production:
- 2 CPU cores
- 4GB RAM
- 50GB SSD
- 100 Mbps network

## Support

### Where can I get help?

- GitHub Issues: https://github.com/rekberkan/kahade/issues
- Email: support@kahade.com
- Documentation: https://docs.kahade.com

### How do I contribute?

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.
