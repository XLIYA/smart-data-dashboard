# Bluviz Smart Dashboard

![Vite](https://img.shields.io/badge/Vite-4+-purple) ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-teal) ![Zustand](https://img.shields.io/badge/State-Zustand-orange) ![Charts](https://img.shields.io/badge/Charts-ECharts/Recharts-informational)

A modern, local‑first **data analytics dashboard** for exploring CSV/Excel data, building charts fast, and exporting clean reports.

## ✨ Features
- Local data store (Zustand)
- CSV/Excel upload & preview
- Interactive Chart Builder
- Export to PDF
- Export to CSV/JSON
- Multiple chart engines (ECharts/Recharts)
- Quick Insights (auto analysis)
- Data cleaning helpers

## 🧱 Tech Stack
- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- ECharts
- Lucide Icons
- ESLint

## 📁 Project Structure (top-level)
```
- README.md
- eslint.config.js
- index.html
- package-lock.json
- package.json
- postcss.config.js
▸ src/
  - App.css
  - App.tsx
  ▸ assets/
  ▸ components/
  - index.css
  ▸ lib/
  - main.tsx
  ▸ routes/
  ▸ stores/
  ▸ styles/
  ▸ types/
  - vite-env.d.ts
- tailwind.config.js
- tsconfig.app.json
- tsconfig.json
- tsconfig.node.json
- vite.config.ts
```

## 🚀 Getting Started

### 1) Prerequisites
- Node.js 18+ and npm 9+ (or pnpm/yarn)

### 2) Install
```bash
npm install
```

### 3) Development
```bash
npm run dev
```
- Starts Vite dev server. Open the printed local URL.

### 4) Build & Preview
```bash
npm run build
npm run preview
```

## ⚙️ Available Scripts
- `dev` — `vite`
- `build` — `tsc -b && vite build`
- `lint` — `eslint .`
- `preview` — `vite preview`

## 🎨 UI & Design
- Tailwind utility classes for styling
- Lucide icons for crisp vector icons
- Optional shadcn/ui & Radix primitives for accessible components
- Motion/animation with Framer Motion

## 📊 Charts
- ECharts and/or Recharts supported
- Interactive **Chart Builder** to map columns (x/y) and choose chart types
- Live preview before saving a chart

## 🗃️ Data
- Local‑first: user data kept in memory/state (Zustand)
- Import CSV/Excel; preview + basic cleaning
- Quick Insights module for fast stats (mean, missing values, duplicates, etc.)

## 📤 Export
- Export charts/data to **PDF** and **CSV/JSON**
- (If installed) `jspdf`, `html2canvas`, and `jspdf-autotable` power the PDF export

## 🔧 Configuration
### TypeScript
- Strict TS config with path aliases (`@/*`) if defined in `tsconfig.json`

### Environment Variables
_No environment variables required by code. Add as needed._

Create a `.env` (or `.env.local`) and prefix client variables with `VITE_` when using Vite, e.g.:
```env
VITE_API_URL=https://api.example.com
```

## 🧪 Quality
- ESLint + Prettier recommended
- Suggested commands:
```bash
npm run lint
npm run format
```
(If not present, add scripts in `package.json`.)

## 🏗️ Suggested Folder Conventions
```
src/
  components/        # Reusable UI
  routes/            # Route-level pages
  stores/            # Zustand stores
  lib/               # Utilities (echarts init, exporters, etc.)
  hooks/             # Custom hooks
  assets/            # Static assets
```
Update as needed to match existing structure.

## 🐞 Troubleshooting
- **`Cannot find package '@vitejs/plugin-react'`** → `npm i -D @vitejs/plugin-react`
- **Type errors for `vite/client`** → Ensure `types: ["vite/client"]` in `tsconfig.json` and `npm i -D vite`
- **ESLint peer conflicts** → Align `@typescript-eslint/*` versions (plugin & parser) across devDependencies
- **Vite fails on Windows paths** → Delete `node_modules` and lockfile, then reinstall

## 🤝 Contributing
1. Create a feature branch: `git checkout -b feat/awesome-thing`
2. Commit with conventional messages: `feat(builder): add scatter plot`
3. Open a PR with before/after screenshots

---

> Generated automatically from the current project structure to give you a clean starting README. Adjust sections (features/envs) to match your exact setup.
