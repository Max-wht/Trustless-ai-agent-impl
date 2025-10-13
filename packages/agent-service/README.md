# @trustless/agent-service

Backend API service for Trustless SocialFi platform.

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database running
- pnpm >= 8.15.0

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:

- `PORT` - Server port (default: 3001)
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Generate Prisma Client:

```bash
pnpm prisma:generate
```

3. Run database migrations:

```bash
pnpm prisma:migrate
```

## Development

```bash
pnpm dev
```

Server will start at http://localhost:3001

## Build

```bash
pnpm build
```

## Production

```bash
pnpm start
```

## API Endpoints

### Health Check

```
GET /health
```

Response:

```json
{
  "status": "ok",
  "service": "agent-service",
  "timestamp": 1697000000000
}
```

### Users

```
GET /users
```

Response:

```json
[
  {
    "id": "clxxx...",
    "walletAddress": "0x1234...5678",
    "createdAt": "2025-10-10T10:00:00.000Z"
  }
]
```

## Prisma Commands

### Generate Client

```bash
pnpm prisma:generate
```

### Run Migrations

```bash
pnpm prisma:migrate
```

### Open Prisma Studio

```bash
pnpm prisma:studio
```

## Linting

```bash
pnpm lint
```

## Tech Stack

- **Framework**: Fastify 4.26+
- **Language**: TypeScript 5.7+
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5.19+
- **CORS**: @fastify/cors
