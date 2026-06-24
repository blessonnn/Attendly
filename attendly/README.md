# Attendly

> A robust, offline-capable Progressive Web Application (PWA) for seamless attendance management and reporting.

Attendly is engineered to provide reliable attendance tracking, engineered with offline-first capabilities to ensure data integrity regardless of network conditions. Built on a modern React/Next.js stack, it offers high performance, local data persistence, and comprehensive export features.

## 🏗 Architecture & Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI & Styling:** React 19, [Tailwind CSS 4](https://tailwindcss.com/), `lucide-react` for iconography
- **Local Persistence:** [Dexie.js](https://dexie.org/) (IndexedDB wrapper for reactive, offline-first data storage)
- **PWA Capabilities:** [@serwist/next](https://serwist.build/) for service worker and caching strategies
- **Data Processing:** `papaparse` for CSV operations, `jspdf` for robust PDF report generation

## ✨ Core Features

- **Offline-First PWA:** Continues functioning seamlessly without an internet connection. Data is synced and stored locally via IndexedDB.
- **Efficient Tracking:** Streamlined interface for managing and tracking attendance records.
- **Reporting & Exports:** Generate comprehensive PDF reports (`jspdf`) or export data to CSV (`papaparse`) for external analytics.
- **Responsive Design:** Optimized for both desktop and mobile environments using a utility-first CSS architecture.

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository and navigate to the project root.
2. Install the dependencies:

```bash
npm install
```

### Development Server

Start the local development server:

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

### Build & Production

To create an optimized production build:

```bash
npm run build
npm run start
```

## 📁 Project Structure

```text
├── src/
│   ├── app/            # Next.js App Router (Pages, Layouts, API routes)
│   ├── types/          # TypeScript interface and type definitions
│   └── ...             # Components, hooks, and utilities
├── public/             # Static assets (images, manifest, icons)
├── package.json        # Dependencies and scripts
└── ...                 # Configuration files (Next, Tailwind, ESLint, etc.)
```

## 🛠 Scripts

- `npm run dev`: Starts the Next.js development server with Webpack.
- `npm run build`: Compiles the application for production deployment.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to ensure code quality and consistency.

## 🤝 Contributing

1. Adhere to the established code style (enforced via ESLint).
2. Ensure components are strongly typed with TypeScript.
3. Keep the offline-first architecture in mind when adding new data fetching or mutation logic.

---
*Maintained by the Attendly Engineering Team.*
