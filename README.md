# InsightOS

> AI-powered business management dashboard for small businesses — manage inventory, track sales, record expenses, and get intelligent insights.

![InsightOS](https://img.shields.io/badge/InsightOS-Business_Suite-7c3aed?style=for-the-badge) ![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge) ![Node](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white) ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)

---

## Overview

InsightOS is a full-stack business analytics platform built for small business owners who want to move beyond spreadsheets. It combines inventory management, sales tracking, expense monitoring, and AI-driven insights into a single modern dashboard.

The AI assistant (powered by Google Gemini) analyzes your real business data and provides actionable recommendations — from identifying your top-selling products to spotting expense trends.

**Supported languages:** English & Bengali

---

## Key Features

### Inventory Management
- Product CRUD with name, category, price, and stock tracking
- Low stock alerts with configurable thresholds
- Search and category-based filtering
- Paginated product listings

### Sales Tracking
- Record sales with automatic total calculation
- Atomic stock management via MongoDB transactions
- Sales analytics: revenue, quantity, top products, daily trends
- Filter by date range and product

### Expense Monitoring
- Track expenses across 8 categories (rent, salary, utilities, marketing, supplies, transport, maintenance, other)
- Expense summaries with category breakdown and daily trends
- Filter by category and date range

### AI Business Assistant
- Chat with an AI that has access to your real business data
- Get insights on revenue, expenses, profit margins, and inventory
- Multi-turn conversation support
- Powered by Google Gemini 2.5 Flash

### Dashboard
- Real-time revenue, expense, and profit metrics
- Revenue trend charts
- Top products ranking
- Expense breakdown by category
- Quick action buttons

### User Experience
- Dark mode / Light mode toggle
- English & Bengali language support
- Smooth animations (Framer Motion)
- Responsive design
- Avatar upload support

### Security
- JWT authentication with refresh tokens (httpOnly cookies)
- Role-based authorization (user/admin)
- Rate limiting (100 req/hr general, 20 req/hr for AI)
- NoSQL injection sanitization
- Helmet security headers
- Password validation (uppercase, lowercase, number, special character)

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** + **Express 5** | Server framework |
| **MongoDB** + **Mongoose 9** | Database & ODM |
| **Google Gemini AI** | Business insights |
| **JWT** + **bcrypt** | Authentication & security |
| **Zod** | Request validation |
| **Multer** | File uploads |
| **Pino** | Logging |

### Frontend

| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 8** | Build tool |
| **Tailwind CSS 4** | Styling |
| **TanStack React Query** | Data fetching & caching |
| **Zustand** | State management |
| **React Hook Form** + **Zod** | Forms & validation |
| **Recharts** | Data visualization |
| **Framer Motion** | Animations |
| **Axios** | HTTP client |

---

## Getting Started

### Prerequisites

- **Node.js** 20+ and **pnpm** (or npm)
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Google Gemini API key** (from [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

```bash
git clone https://github.com/yourusername/InsightOS.git
cd InsightOS
```

### Backend Setup

```bash
cd backend
pnpm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/insightos
JWT_ACCESS_SECRET=your-access-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
AI_PROVIDER=gemini
AI_MODEL=gemini-2.5-flash
GEMINI_API_KEY=your-gemini-api-key-here
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Start the development server:

```bash
pnpm dev
```

Backend runs at `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs at `http://localhost:5173`

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| PATCH | `/api/auth/me` | Update profile |
| POST | `/api/auth/me/avatar` | Upload avatar |
| DELETE | `/api/auth/me/avatar` | Delete avatar |

### Products

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/products` | Create product |
| GET | `/api/products` | List products (paginated) |
| GET | `/api/products/low-stock` | Get low stock items |
| GET | `/api/products/:id` | Get product |
| PATCH | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Sales

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/sales` | Record sale |
| GET | `/api/sales` | List sales (paginated) |
| GET | `/api/sales/analytics` | Get sales analytics |
| GET | `/api/sales/:id` | Get sale |

### Expenses

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/expenses` | Create expense |
| GET | `/api/expenses` | List expenses (paginated) |
| GET | `/api/expenses/summary` | Get expense summary |
| GET | `/api/expenses/:id` | Get expense |
| PATCH | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

### AI Assistant

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/chat` | Send chat message |
| GET | `/api/ai/conversations` | List conversations |
| GET | `/api/ai/conversations/:id` | Get conversation |
| DELETE | `/api/ai/conversations/:id` | Delete conversation |

### User Account

| Method | Endpoint | Description |
|---|---|---|
| DELETE | `/api/user/data` | Clear all business data |
| DELETE | `/api/user/account` | Delete account |

### System

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |

---

## Database Models

### User

| Field | Type | Details |
|---|---|---|
| name | String | Required, max 50 chars |
| email | String | Required, unique, lowercase |
| password | String | Hashed (bcrypt 12 rounds), min 8 chars |
| role | String | `user` or `admin` |
| refreshToken | String | Stored for refresh flow |
| avatar | String | File path to uploaded avatar |

### Product

| Field | Type | Details |
|---|---|---|
| userId | ObjectId | Ref: User |
| name | String | Required, max 100 chars |
| category | String | Required |
| price | Number | Min 0 |
| stock | Number | Min 0, default 0 |
| lowStockThreshold | Number | Default 10 |

### Sale

| Field | Type | Details |
|---|---|---|
| userId | ObjectId | Ref: User |
| productId | ObjectId | Ref: Product |
| quantity | Number | Min 1 |
| unitPrice | Number | Min 0 |
| totalAmount | Number | Auto-calculated |
| saleDate | Date | Indexed |

### Expense

| Field | Type | Details |
|---|---|---|
| userId | ObjectId | Ref: User |
| title | String | Required, max 100 chars |
| amount | Number | Min 0 |
| category | String | Enum (8 categories) |
| date | Date | Indexed |

---

## Project Structure

```
InsightOS/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment, DB, AI config
│   │   ├── middleware/       # Auth, error handling, upload
│   │   ├── modules/         # Feature modules
│   │   │   ├── ai/          # AI chat & conversations
│   │   │   ├── auth/        # Authentication & user management
│   │   │   ├── expense/     # Expense tracking
│   │   │   ├── product/     # Product inventory
│   │   │   ├── sales/       # Sales recording & analytics
│   │   │   └── user/        # Account management
│   │   ├── routes/          # Central route registry
│   │   └── utils/           # Error classes, tokens, logger
│   └── uploads/             # User avatars
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios config & API modules
│   │   ├── components/      # Reusable UI components
│   │   │   ├── charts/      # Recharts visualizations
│   │   │   ├── layout/      # Sidebar, Topbar, AppLayout
│   │   │   └── ui/          # Button, Card, Modal, Table...
│   │   ├── context/         # Language context (i18n)
│   │   ├── hooks/           # React Query hooks
│   │   ├── lib/             # Translations, motion variants
│   │   ├── pages/           # Route pages
│   │   ├── store/           # Zustand stores
│   │   └── utils/           # Helpers (cn, config, format)
│   └── index.html
```

---

## Architecture

The backend follows a **modular architecture** with clean separation of concerns:

```
Controller → Service → Repository → Model
```

- **Controller** — Handles HTTP requests/responses
- **Service** — Business logic and orchestration
- **Repository** — Database queries and data access
- **Model** — Mongoose schema definitions

Each module (auth, product, sales, expense, ai, user) is self-contained with its own controllers, services, repositories, models, and validation schemas.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGODB_URI` | Yes | — | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Yes | — | Access token secret |
| `JWT_REFRESH_SECRET` | Yes | — | Refresh token secret |
| `GEMINI_API_KEY` | No | — | Google Gemini API key |
| `PORT` | No | `5000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `AI_PROVIDER` | No | `gemini` | AI provider |
| `AI_MODEL` | No | `gemini-2.5-flash` | AI model name |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Frontend origin |

---

## License

This project is licensed under the MIT License.

---

Built with care for small business owners who deserve better tools.
