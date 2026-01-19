# Prisma schema layout

The Prisma schema has been split into multiple `.prisma` files under the
`schema/` directory for readability. Use the schema folder when running Prisma
CLI commands:

```bash
prisma generate --schema ./schema
prisma migrate dev --schema ./schema
```

Ensure your Prisma client generator enables the `prismaSchemaFolder` preview
feature (already set in `schema/00_base.prisma`).

The `migration-constraints.sql` file still applies after migrations.
