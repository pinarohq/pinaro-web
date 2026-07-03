# Sumit Web Studio — Premium Portfolio

A cinematic, production-grade portfolio for **Sumit Web Studio** — a frontend-only React application with EmailJS for contact and newsletter submissions.

**Stack:** React + Tailwind CSS + EmailJS · No backend required.

## Project path

```
D:\sumit-web-studio\frontend
```

All commands below are run from the `frontend` folder.

## How to run

### Prerequisites

- Node.js 18+

### 1. Install dependencies (first time only)

```bash
cd D:\sumit-web-studio\frontend
npm install
```

### 2. Start the development server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Production build (optional)

```bash
npm run build
```

Deploy the generated `build/` folder to **Vercel**, **Netlify**, or **GitHub Pages**.

## Environment variables

EmailJS credentials live in **`frontend/.env`**. Copy from **`frontend/.env.example`** if needed:

| Variable | Description |
|---|---|
| `REACT_APP_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `REACT_APP_EMAILJS_OWNER_TEMPLATE_ID` | Business notification template |
| `REACT_APP_EMAILJS_CUSTOMER_TEMPLATE_ID` | Customer thank-you auto-reply template |
| `REACT_APP_EMAILJS_PUBLIC_KEY` | EmailJS public key |

For hosted deployments, add the same variables in your platform's environment settings.

## What's included

- Cinematic hero, glass navigation, command palette (`Ctrl+K`)
- About, services, projects, skills, process, testimonials
- Contact form (EmailJS — business notification + customer auto-reply)
- Newsletter signup (EmailJS)
- Interactive 404 mini-game, custom cursor, smooth scroll, dark mode

## Project structure

```
sumit-web-studio/
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/portfolio/
    │   ├── pages/
    │   ├── data/
    │   ├── lib/
    │   └── context/
    ├── .env
    └── package.json
```

## Contact

- **Email:** socialmain2025@gmail.com
- **Studio:** Sumit Web Studio
