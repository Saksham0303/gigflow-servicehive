# GigFlow Backend

Node.js + Express backend for the GigFlow gig marketplace application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Ensure MongoDB is running locally:
```bash
mongod
```

3. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Gigs
- `GET /api/gigs` - Get all gigs
- `POST /api/gigs` - Create a new gig (requires authentication)
- `GET /api/gigs/:gigId` - Get a specific gig

### Bids
- `POST /api/bids` - Place a bid on a gig (requires authentication)
- `GET /api/bids/:gigId` - Get all bids for a gig
- `PATCH /api/bids/:bidId/hire` - Hire a freelancer (requires authentication, gig owner only)

## Architecture

- **Models**: User, Gig, Bid (MongoDB + Mongoose)
- **Authentication**: JWT stored in HttpOnly cookies
- **Password Security**: bcryptjs hashing
- **Concurrency**: Transactions for the hire endpoint to prevent race conditions

## Environment Variables

See `.env.example` for required configuration.
