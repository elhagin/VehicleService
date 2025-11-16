# Dealer Vehicle Service

A multi-tenant inventory management service built with NestJS, Prisma, and PostgreSQL. This service manages dealers and their vehicle inventories with tenant isolation and role-based access control.

## Features

- 🏢 **Multi-tenant Architecture**: Complete tenant isolation using `tenant_id` scoping
- 🚗 **Vehicle Management**: CRUD operations for vehicles with advanced filtering
- 👥 **Dealer Management**: Manage dealers with subscription types (BASIC/PREMIUM)
- 🔐 **Role-Based Access Control**: Support for GLOBAL_ADMIN role with admin endpoints
- 📊 **Pagination & Sorting**: Built-in pagination and sorting for list endpoints
- 🔍 **Advanced Filtering**: Filter vehicles by model, status, price range, and subscription type
- ✅ **Input Validation**: Comprehensive validation using class-validator
- 🐳 **Docker Support**: PostgreSQL database via Docker Compose

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (v10.0.0)
- **ORM**: [Prisma](https://www.prisma.io/) (v6.19.0)
- **Database**: PostgreSQL 16
- **Language**: TypeScript
- **Validation**: class-validator, class-transformer

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Docker and Docker Compose
- PostgreSQL 16 (or use Docker Compose)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DealerVehicleService
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Update the `.env` file with your database configuration:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory"
```

4. Start the PostgreSQL database:
```bash
docker-compose up -d
```

5. Run Prisma migrations:
```bash
npm run prisma:migrate
```

6. Generate Prisma Client:
```bash
npm run prisma:generate
```

7. (Optional) Seed the database:
```bash
npm run prisma:seed
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

The application will start on `http://localhost:3000`

### Production Mode
```bash
npm run build
npm run start
```

## API Endpoints

### Authentication Headers

All endpoints require the following headers:
- `X-Tenant-Id`: Required tenant identifier
- `X-Roles`: Comma-separated list of roles (e.g., `GLOBAL_ADMIN`)

### Dealers

- `POST /dealers` - Create a new dealer
- `GET /dealers` - List dealers (with pagination and sorting)
- `GET /dealers/:id` - Get dealer by ID
- `PATCH /dealers/:id` - Update dealer
- `DELETE /dealers/:id` - Delete dealer

### Vehicles

- `POST /vehicles` - Create a new vehicle
- `GET /vehicles` - List vehicles with filters:
  - `model`: Filter by vehicle model (partial match)
  - `status`: Filter by status (AVAILABLE, SOLD)
  - `priceMin`: Minimum price filter
  - `priceMax`: Maximum price filter
  - `subscription`: Filter by dealer subscription type (PREMIUM)
- `GET /vehicles/:id` - Get vehicle by ID
- `PATCH /vehicles/:id` - Update vehicle
- `DELETE /vehicles/:id` - Delete vehicle

### Admin (GLOBAL_ADMIN only)

- `GET /admin/dealers/countBySubscription` - Get dealer counts by subscription type across all tenants

### Pagination & Sorting

All list endpoints support pagination and sorting via query parameters:
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20, max: 100)
- `sortBy`: Field to sort by
- `sortOrder`: Sort direction (`asc` or `desc`)

Response format:
```json
{
  "data": [...],
  "page": 1,
  "pageSize": 20,
  "total": 100,
  "totalPages": 5
}
```

## Data Model

### Dealer
- `id`: UUID (primary key)
- `tenant_id`: String (tenant identifier)
- `name`: String
- `email`: String (unique)
- `subscriptionType`: SubscriptionType enum (BASIC, PREMIUM)
- `vehicles`: Vehicle[] (relation)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Vehicle
- `id`: UUID (primary key)
- `tenant_id`: String (tenant identifier)
- `dealerId`: UUID (foreign key to Dealer)
- `model`: String
- `price`: Decimal (12, 2)
- `status`: VehicleStatus enum (AVAILABLE, SOLD)
- `dealer`: Dealer (relation)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Multi-Tenancy

The service implements multi-tenancy at the application layer:

1. **Tenant Context Middleware**: Extracts `X-Tenant-Id` from request headers and attaches it to the request context
2. **Tenant Guard**: Ensures tenant ID is present on all requests
3. **Data Scoping**: All database queries are automatically scoped by `tenant_id`
4. **Cross-Tenant Protection**: Attempts to access data from other tenants result in 403 Forbidden

## Project Structure

```
DealerVehicleService/
├── apps/
│   └── inventory/
│       └── src/
│           ├── admin/          # Admin module (GLOBAL_ADMIN endpoints)
│           ├── common/         # Shared utilities
│           │   ├── filters/    # Exception filters
│           │   ├── guards/     # Authentication/authorization guards
│           │   ├── interceptors/ # Response interceptors
│           │   └── middleware/ # Request middleware
│           ├── dealers/        # Dealers module
│           ├── vehicles/       # Vehicles module
│           ├── prisma/         # Prisma module
│           ├── app.module.ts   # Root module
│           └── main.ts         # Application entry point
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seed script
├── docker-compose.yml         # PostgreSQL container
├── nest-cli.json              # NestJS CLI configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with watch
- `npm run build` - Build the application
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed the database

## Testing

Run E2E tests:
```bash
npm test
```

## Error Handling

The service includes comprehensive error handling:
- **400 Bad Request**: Missing or invalid `X-Tenant-Id` header
- **403 Forbidden**: Cross-tenant access attempts or unauthorized operations
- **404 Not Found**: Resource not found within tenant scope
- **422 Unprocessable Entity**: Validation errors

## Development

### Adding a New Module

1. Generate module, controller, and service:
```bash
nest generate module <module-name>
nest generate controller <module-name>
nest generate service <module-name>
```

2. Create DTOs in `dto/` directory
3. Implement tenant-scoped queries in service
4. Add routes to controller with `@UseGuards(TenantGuard)`

### Database Migrations

Create a new migration:
```bash
npm run prisma:migrate
```

Apply migrations in production:
```bash
npx prisma migrate deploy
```

## License

[Add your license here]

## Contributing

[Add contributing guidelines here]

