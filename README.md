<div align="center">
  <img src="public/readme-logo.webp" alt="Golden Jumpers Heaven Logo" width="460" height="460" />
  <br />
</div>

<h1 align="center" >Jumpers Heaven Statistics</h1>
<br />

**Jumpers Heaven Statistics** is a modern, high-performance web application designed to track and display statistics for the <a href="https://jumpersheaven.com">Jumpers Heaven</a> community. Built with Next.js, it provides real-time insights into server status, player rankings, map records, and more.

---

## Features

- **Server Browser**: View active servers, current players, and map details in real-time.
- **Global Leaderboards**: comprehensive rankings for players across all maps and modes.
- **Map Statistics**: Detailed records and best times for individual maps.
- **Player Profiles**: In-depth player stats, including personal bests, recent activity.
- **Favorites System**: Personalized tracking for favorite maps and players.
- **Scoring System**: Transparent explanation of how points and ranks are calculated.
- **Responsive Design**: Optimized for a seamless experience on both desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Sass](https://sass-lang.com/) (SCSS)
- **Data Serialization**: [MessagePack](https://msgpack.org/) (via `@msgpack/msgpack` & `msgpackr`)
- **Linting**: ESLint

## Installation

Follow these steps to set up the project locally:

1.  **Clone the repository**

    ```bash
    git clone git@github.com:Moamal-2000/jumpers-heaven-statistics.git
    cd jumpers-heaven-statistics
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Run the development server**

    ```bash
    npm run dev
    ```

4.  **Open the app**
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Navigation

- **Servers**: Check current server activity.
- **Leaderboards**: Browse top players globally.
- **Maps**: Search and view stats for specific maps.
- **Search**: Quickly find players or maps using the global search feature.

### Development Commands

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Project Structure

```text
.
├── public/                  # Static files (logos, Open Graph images, map/country assets)
│   ├── assets/
│   └── openGraph/
├── src/
│   ├── app/                 # Next.js App Router entry, layouts, metadata, and route handlers
│   │   ├── (pages)/         # Route-group pages (servers, maps, players, favorites, etc.)
│   │   ├── api/             # App Router API endpoints
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── not-found.js
│   │   └── RootProviders.jsx
│   ├── api/                 # External API clients/services
│   ├── components/          # UI components
│   │   ├── Pages/           # Page-specific UI
│   │   ├── Shared/          # Reusable shared UI
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Helper/
│   ├── data/                # Constants, metadata, static datasets, and config objects
│   ├── hooks/               # Custom React hooks
│   │   ├── app/
│   │   └── helper/
│   ├── lib/                 # Core utilities and low-level modules
│   │   └── api/
│   ├── redux/               # Global state management
│   │   ├── features/        # Feature slices/thunks/apis
│   │   ├── msgPack/         # MessagePack base query support
│   │   └── store.js
│   └── styles/              # Global SCSS variables, mixins, and styles
├── next.config.mjs
├── package.json
└── README.md
```

## License

This project is proprietary. All rights reserved.

## Contact

[**Moamal Alaa**](https://moamalalaa.netlify.app)

Project Repository: [https://github.com/Moamal-2000/jumpers-heaven-statistics](https://github.com/Moamal-2000/jumpers-heaven-statistics)
