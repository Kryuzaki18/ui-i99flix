<div align="center">

# React Movie App — i99flix

**A modern, full-featured movie and TV streaming discovery app built with React, TypeScript, and Vite.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

[Live Demo](https://i99flix.com) · [Report Bug](https://github.com/Kryuzaki18/react-movie-app/issues) · [Request Feature](https://github.com/Kryuzaki18/react-movie-app/issues)

---

</div>

## Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Available Scripts](#available-scripts)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About the Project

**i99flix** is a single-page application (SPA) for browsing, searching, and streaming movies and TV shows. It integrates the TMDB API for content, Firebase for authentication, and a custom backend for watchlists and internal movie data.

The app supports full user account management (signup, login, email verification, password reset), a personal watchlist, an embedded video player with server selection, and a dark/light theme — all wrapped in a responsive Ant Design UI.

---

## Tech Stack

| Layer                | Technology                                                          | Purpose                                  |
| -------------------- | ------------------------------------------------------------------- | ---------------------------------------- |
| **UI Framework**     | [React 19](https://react.dev/)                                      | Component-based UI rendering             |
| **Language**         | [TypeScript 6](https://www.typescriptlang.org/)                     | Static typing & developer tooling        |
| **Build Tool**       | [Vite 8](https://vitejs.dev/)                                       | Lightning-fast HMR & optimized builds    |
| **Routing**          | [React Router DOM 7](https://reactrouter.com/)                      | Client-side routing                      |
| **Server State**     | [TanStack React Query 5](https://tanstack.com/query)                | API data fetching, caching, sync         |
| **Client State**     | [Zustand 5](https://zustand-demo.pmnd.rs/)                          | Lightweight global state management      |
| **UI Components**    | [Ant Design 6](https://ant.design/)                                 | Component library with theming support   |
| **Authentication**   | [Firebase 12](https://firebase.google.com/)                         | Auth (email/password, social login)      |
| **Movie Data**       | [TMDB API](https://www.themoviedb.org/documentation/api)            | Movie and TV show metadata               |
| **Linting**          | [ESLint](https://eslint.org/) (flat config)                         | Code quality enforcement                 |

---

## Project Structure

```
react-movie-app/
├── public/                        # Static assets served as-is
├── src/
│   ├── api/                       # React Query hooks & API clients
│   │   ├── environments.ts        # API base URLs per environment
│   │   ├── queryKeys.ts           # Centralized React Query key factory
│   │   ├── tmdbApi.ts             # TMDB REST client
│   │   ├── watchlistApi.ts        # Watchlist backend client
│   │   ├── useAuthQuery.ts
│   │   ├── useBrowseQuery.ts
│   │   ├── useInternalMoviesQuery.ts
│   │   ├── useMoviesQuery.ts
│   │   ├── useTmdbQuery.ts
│   │   └── useWatchlistQuery.ts
│   ├── components/
│   │   ├── auth/
│   │   │   └── SocialLoginButtons.tsx
│   │   ├── navigation/
│   │   │   ├── nav/               # Top navigation bar
│   │   │   └── sidebar/           # Collapsible sidebar
│   │   ├── ui/
│   │   │   ├── cast-section/
│   │   │   ├── expandable-text/
│   │   │   ├── hero-banner/
│   │   │   ├── movie-card/
│   │   │   ├── movie-card-skeleton/
│   │   │   ├── movie-detail-drawer/
│   │   │   ├── movie-list-row/
│   │   │   ├── server-iframe/
│   │   │   ├── server-selector/
│   │   │   └── tv-episode-selector/
│   │   └── ErrorBoundary.tsx
│   ├── config/
│   │   └── firebase.ts            # Firebase app initialization
│   ├── constants/                 # App-wide constants
│   │   ├── genres.ts
│   │   ├── pagination.ts
│   │   ├── theme.ts
│   │   └── yearRanges.ts
│   ├── context/
│   │   └── ThemeContext.tsx       # Dark/light theme context
│   ├── features/                  # Route-level feature modules
│   │   ├── auth/                  # Login, signup, forgot/reset password, verify email
│   │   ├── browse/                # Browse movies & TV with filters
│   │   ├── dev/                   # Dev-only utilities
│   │   ├── home/                  # Home/landing page
│   │   ├── legal/                 # Terms & privacy pages
│   │   ├── player/                # Streaming player page
│   │   ├── profile/               # User profile management
│   │   ├── video-player/          # Embedded video player component
│   │   └── watchlist/             # User watchlist
│   ├── hooks/                     # Custom React hooks
│   │   ├── useDebounce.ts
│   │   ├── usePageTitle.ts
│   │   ├── useResolvedGenres.ts
│   │   ├── useTrailerKey.ts
│   │   └── useWatchlistStatus.ts
│   ├── models/                    # TypeScript interfaces & types
│   │   ├── authModel.ts
│   │   ├── movieModel.ts
│   │   ├── tmdbModel.ts
│   │   └── watchlistModel.ts
│   ├── services/                  # Business logic / service layer
│   │   ├── apiService.ts
│   │   ├── authService.ts
│   │   ├── messageService.ts
│   │   └── movieService.ts
│   ├── store/                     # Zustand state stores
│   │   ├── authStore.ts
│   │   ├── browseStore.ts
│   │   ├── homeStore.ts
│   │   ├── playerStore.ts
│   │   ├── tmdbStore.ts
│   │   └── watchlistStore.ts
│   ├── utils/
│   │   └── tmdbAdapter.ts         # Normalizes TMDB responses
│   ├── App.tsx                    # Root component with routes & providers
│   ├── main.tsx                   # Entry point (React Query, Suspense)
│   └── index.css                  # Global styles
├── example.env                    # Environment variable template
├── eslint.config.js               # ESLint flat config
├── index.html                     # HTML entry point (Vite)
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- **Node.js** `>= 18.0.0` — [Download here](https://nodejs.org/)
- **npm** `>= 9.0.0`
- A [TMDB API key](https://www.themoviedb.org/settings/api)
- A [Firebase project](https://console.firebase.google.com/) with Authentication enabled

Verify your Node version:

```bash
node --version
npm --version
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Kryuzaki18/react-movie-app.git
cd react-movie-app
```

2. **Install dependencies**

```bash
npm install
```

### Environment Variables

Copy the template and fill in your credentials:

```bash
cp example.env .env
```

Open `.env` and set the following Firebase values (all required):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

> The dev server also proxies `/api` requests to `http://localhost:4321` (a local backend). If you are running without the backend, API-dependent features (watchlist, internal movie data) will not work.

### Running the App

**Development server** (with HMR):

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:1234](http://localhost:1234).

---

## Available Scripts

| Command           | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `npm run dev`     | Start the development server on port 1234 with HMR         |
| `npm run build`   | Type-check and compile a production-ready build to `/dist` |
| `npm run preview` | Locally preview the production build                       |
| `npm run lint`    | Run ESLint across all `.ts` and `.tsx` files               |

---

## Features

- **Authentication** — Email/password and social login via Firebase; full signup, login, email verification, forgot/reset password flows
- **Movie & TV Browse** — Filter by genre, year range, and media type; paginated results via TMDB API
- **Movie Detail Drawer** — Cast, overview, ratings, and trailer in a side drawer without leaving the page
- **Video Player** — Embedded player with multiple server options and TV episode selector
- **Watchlist** — Add/remove titles to a personal watchlist synced to the backend
- **Dark / Light Theme** — System-aware theme toggle powered by Ant Design ConfigProvider
- **Responsive Design** — Adaptive layout for desktop, tablet, and mobile
- **Code Splitting** — All route-level components are lazy-loaded for fast initial load
- **Type-Safe** — Strict TypeScript 6 configuration throughout the codebase

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. **Create** your feature branch

```bash
git checkout -b feature/your-feature-name
```

3. **Commit** your changes

```bash
git commit -m "feat: add your feature description"
```

4. **Push** to your branch

```bash
git push origin feature/your-feature-name
```

5. **Open** a Pull Request against the `main` branch

Make sure `npm run lint` passes before submitting.

---

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## Contact

**Kryuzaki18** — [@Kryuzaki18](https://github.com/Kryuzaki18)

Project Link: [https://github.com/Kryuzaki18/react-movie-app](https://github.com/Kryuzaki18/react-movie-app)

---

<div align="center">

Made with TypeScript

If you found this project useful, please consider giving it a star!

</div>
