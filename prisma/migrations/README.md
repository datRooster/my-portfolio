This project was migrated from PostgreSQL to MySQL.

The PostgreSQL-specific SQL migrations were removed because they are not compatible with the MySQL connector.

Create a fresh MySQL baseline with Prisma after configuring `DATABASE_URL`:

1. `npm run db:generate`
2. `npx prisma migrate dev --name init_mysql`

If you need to preserve production data, export it from the PostgreSQL source first and import it into MySQL with a dedicated migration script.
