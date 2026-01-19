# Prisma schema layout

The Prisma schema has been split into multiple `.prisma` files under the
`schema/` directory for readability. Use the schema folder when running Prisma
CLI commands:

```bash
prisma generate --schema ./schema
prisma migrate dev --schema ./schema
```

The `migration-constraints.sql` file still applies after migrations.
