<div align="center">

# 🎬 React Movie App

**A modern, fast, and type-safe movie discovery application built with React, TypeScript, and Vite.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

[Live Demo](#) · [Report Bug](https://github.com/Kryuzaki18/react-movie-app/issues) · [Request Feature](https://github.com/Kryuzaki18/react-movie-app/issues)

---

</div>

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Available Scripts](#-available-scripts)
- [Features](#-features)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About the Project

**React Movie App** is a single-page application (SPA) designed for movie enthusiasts who want a clean, responsive interface to browse, search, and explore movies. Built on a modern frontend stack, this project prioritizes developer experience (DX), performance, and maintainability.

The codebase is **94.6% TypeScript**, reflecting a commitment to type safety, predictable data flows, and scalable architecture — hallmarks of production-quality frontend engineering.

---

## 🛠 Tech Stack

| Layer            | Technology                                      | Purpose                               |
| ---------------- | ----------------------------------------------- | ------------------------------------- |
| **UI Framework** | [React 19](https://react.dev/)                  | Component-based UI rendering          |
| **Language**     | [TypeScript 5](https://www.typescriptlang.org/) | Static typing & developer tooling     |
| **Build Tool**   | [Vite 6](https://vitejs.dev/)                   | Lightning-fast HMR & optimized builds |
| **Linting**      | [ESLint](https://eslint.org/)                   | Code quality enforcement              |
| **Styling**      | CSS Modules                                     | Scoped, maintainable component styles |

> **Why Vite?** Vite leverages native ES modules in development and Rollup under the hood for production, resulting in near-instant cold starts and hot module replacement (HMR) that is orders of magnitude faster than webpack-based setups.

---

## 📁 Project Structure

```
react-movie-app/
├── public/                  # Static assets served as-is
├── src/                     # Application source code
│   ├── components/          # Reusable UI components
│   ├── pages/               # Route-level page components
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions & interfaces
│   ├── utils/               # Utility/helper functions
│   ├── App.tsx              # Root application component
│   └── main.tsx             # Application entry point
├── .gitignore               # Git exclusion rules
├── eslint.config.js         # ESLint flat config
├── index.html               # HTML entry point (Vite)
├── package.json             # Project metadata & dependencies
├── tsconfig.json            # Base TypeScript config
├── tsconfig.app.json        # App-specific TypeScript config
├── tsconfig.node.json       # Node/tooling TypeScript config
└── vite.config.ts           # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine before proceeding:

- **Node.js** `>= 18.0.0` — [Download here](https://nodejs.org/)
- **npm** `>= 9.0.0` or **yarn** `>= 1.22.0`

Verify your versions:

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
# or
yarn install
```

### Running the App

**Development server** (with HMR):

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:1234](http://localhost:1234).

---

## 📜 Available Scripts

| Command           | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `npm run dev`     | Start the development server with Hot Module Replacement   |
| `npm run build`   | Type-check and compile a production-ready build to `/dist` |
| `npm run preview` | Locally preview the production build                       |
| `npm run lint`    | Run ESLint across all `.ts` and `.tsx` files               |

---

## ✨ Features

- 🔍 **Movie Search** — Instantly search for movies by title
- 🎞️ **Movie Details** — View detailed info including overview, rating, and release date
- 📱 **Responsive Design** — Fully adaptive layout across desktop, tablet, and mobile
- ⚡ **Blazing Fast** — Powered by Vite's native ESM dev server and optimized production builds
- 🔒 **Type-Safe** — Strict TypeScript configuration ensures reliable, self-documenting code
- 🧹 **Linting** — ESLint integration with type-aware rules for consistent code quality

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Here's how to get involved:

1. **Fork** the repository
2. **Create** your feature branch

```bash
git checkout -b feature/your-feature-name
```

3. **Commit** your changes with a clear message

```bash
git commit -m "feat: add your feature description"
```

4. **Push** to your branch

```bash
git push origin feature/your-feature-name
```

5. **Open** a Pull Request against the `main` branch

Please make sure your code passes `npm run lint` before submitting.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 📬 Contact

**Kryuzaki18** — [@Kryuzaki18](https://github.com/Kryuzaki18)

Project Link: [https://github.com/Kryuzaki18/react-movie-app](https://github.com/Kryuzaki18/react-movie-app)

---

<div align="center">

Made with ❤️ and TypeScript

⭐ If you found this project useful, please consider giving it a star!

</div>
