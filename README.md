
# Trader Dash

A React-based trading analysis dashboard that consumes a Django REST API to visualize trading data.

## Features

- **CSV Uploads**: Upload trade data files with validation
- **Dashboard Visualization**: Interactive charts for trade analysis
- **Customizable Layouts**: Drag and drop widgets to create personalized views
- **Upload History**: Browse and manage past uploads
- **API Integration**: Consumes a Django REST API for data processing

## Tech Stack

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** for styling
- **react-hook-form** (+ zod) for form handling and validation
- **React Query** for API data fetching
- **Recharts**, **react-chartjs-2**, and **Victory** for data visualization
- **react-grid-layout** for the dashboard grid system
- **Context API** + custom hooks for state management

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Authentication (if needed)
VITE_AUTH_ENABLED=false
```

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at http://localhost:8080

## API Endpoints

The application consumes the following API endpoints:

- **Uploads**
  - `GET /api/uploads/`: List all uploads
  - `GET /api/uploads/{id}/`: Get upload details
  - `POST /api/uploads/`: Upload a new file
  - `DELETE /api/uploads/{id}/`: Delete an upload

- **Metrics**
  - `GET /api/metrics/?uploadId={uploadId}`: Get metrics for a specific upload
  - `GET /api/metrics/symbols/?uploadId={uploadId}`: Get available symbols for an upload

- **Preferences**
  - `GET /api/preferences/`: Get user preferences
  - `POST /api/preferences/`: Create user preferences
  - `PUT /api/preferences/{id}/`: Update user preferences

## CSV Format

The application expects CSV files in the following format:

```csv
timestamp,symbol,side,price,quantity
2023-05-15T14:30:00Z,AAPL,buy,150.25,100
2023-05-15T14:35:22Z,MSFT,sell,290.75,50
```

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run unit tests
npm run test

# Lint
npm run lint
```

## Project Structure

```
src/
├── components/        # UI components
│   ├── charts/        # Chart components
│   ├── dashboard/     # Dashboard components
│   ├── history/       # History components
│   ├── layout/        # Layout components
│   ├── ui/            # UI components (shadcn)
│   └── upload/        # Upload components
├── contexts/          # Context providers
├── hooks/             # Custom hooks
├── lib/               # Utility functions
├── pages/             # Page components
└── types/             # TypeScript type definitions
```
