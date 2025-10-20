# Smart Data Dashboard

> Version: 0.0.1

A minimal, fast, and elegant **data dashboard** built with **Vite + React**, **TypeScript**, and **Tailwind CSS**, featuring modern **shadcn/ui** components and **lucide-react** icons.  
This project provides an interactive environment for **uploading, previewing, visualizing (ECharts)**, and **exporting (PDF / Word)** datasets — all with a clean and consistent UI.

---

## ✨ Key Features
- Sleek and modern UI built with **shadcn/ui**
- **lucide-react** icons and rounded hoverable buttons
- Modular, scalable component structure
- Light/Dark mode theme support
- Minimal **UploadDropzone** for file uploads
- Interactive **ChartBuilder** using ECharts (`bar`, `line`, `scatter`)
- **Export to PDF/Word** (client-side ready)
- Fully **TypeScript**-based and ESLint-ready

---

## 🧱 Tech Stack
- ⚡ **Vite + React**
- 💎 **TypeScript**
- 🎨 **Tailwind CSS**
- 🧩 **shadcn/ui**
- 🔆 **lucide-react**
- 📊 **ECharts (custom wrapper)**

---

## 🗂 Project Structure (sample)
```
📁 src/
  📁 components/
  📁 hooks/
  📁 pages/
  📁 utils/
  📄 main.tsx
  📄 App.tsx
```

---

## 🚀 Getting Started
### 1. Requirements
- Node.js ≥ 18  
- npm

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

---

## 🧪 Available Scripts
- `dev` → start development server  
- `build` → build production bundle  
- `preview` → preview built app  
- `lint` → run ESLint checks  

---

## ⚙️ Environment Variables
Environment variables detected in the code:
```
-
```

Create a `.env.local` file and set variables as needed.

---

## 🧩 UI Development Notes
- **Select boxes** use prebuilt components from `shadcn/ui`  
- **TopBar** has rounded corners and animated hover states (lucide-react icons only)  
- **UploadDropzone.tsx** redesigned to be minimal and intuitive  
- All texts are in **English** and layout is **LTR**  
- **Contact** button removed from the top bar  
- **Landing** and **Preview** sections refined for better clarity  

---

## 📊 ChartBuilder (ECharts)
- Location: `src/components/ChartBuilder.tsx`
- Props: `open`, `onClose`, `data`, `columns`, `onAdd`
- Chart types: `bar`, `line`, `scatter`

---

## 🧾 Exporting Data
- **PDF Export**: use `jspdf` or `html2pdf.js`
- **Word Export**: use the `docx` library for client-side document generation

---

## 🧹 Code Quality
- Fully linted with **ESLint** and **Prettier**
- Commit messages follow **Conventional Commits** format:
  ```bash
  feat(ui): replace selects with shadcn components and improve hover states
  fix(upload): simplify UploadDropzone styles for minimal look
  ```

---

## 🛠 Common Issues
**Error:** `Cannot find package '@vitejs/plugin-react'`  
➡️ Fix by installing it manually:
```bash
npm add -D @vitejs/plugin-react
```

**Error:** “Objects are not valid as a React child”  
➡️ Make sure to render arrays or strings only. For debugging, use `JSON.stringify()`.

---

## 📦 Deployment
- **Vercel** (recommended) or **Netlify / Static hosting**  
- Set your environment variables in platform settings

---

## 🤝 Contributing
- Please open PRs with clear **before/after** explanations and UI screenshots  
- Run `lint` and `build` before submitting PRs  

---

## 📜 License
MIT License © 2025
