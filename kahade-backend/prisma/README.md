# Prisma Database Schema

This directory contains all database-related files for the Kahade backend.

## Structure

```
prisma/
├── schema.prisma          # Main schema file (imports all schemas)
├── schemas/               # Modular schema files
│   ├── 00_base.prisma    # Base enums and types
│   ├── 10_user_auth.prisma
│   ├── 20_transaction.prisma
│   ├── 30_dispute.prisma
│   └── 40_notification.prisma
├── migrations/            # Database migrations
└── seed.ts               # Database seeding script
```

## Commands

### Generate Prisma Client

```bash
yarn prisma:generate
```

### Create Migration

```bash
yarn prisma migrate dev --name migration_name
```

### Apply Migrations

```bash
yarn prisma:migrate
```

### Reset Database

```bash
yarn prisma migrate reset
```

### Seed Database

```bash
yarn prisma:seed
```

### Open Prisma Studio

```bash
yarn prisma:studio
```

## Schema Organization

The schema is organized into multiple files for better maintainability:

- **00_base.prisma**: Common enums and types
- **10_user_auth.prisma**: User and authentication models
- **20_transaction.prisma**: Transaction and escrow models
- **30_dispute.prisma**: Dispute resolution models
- **40_notification.prisma**: Notification models

## Adding New Models

1. Create a new schema file in `schemas/` directory
2. Add the import in `schema.prisma`
3. Run migration: `yarn prisma migrate dev`

## Best Practices

- Always create migrations in development first
- Test migrations before applying to production
- Keep schema files organized by domain
- Add indexes for frequently queried fields
- Use descriptive migration names
