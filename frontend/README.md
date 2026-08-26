# WellBeingCheck React Frontend

A complete frontend prototype built with React and Vite. It includes a responsive landing page, signup/login validation, dashboard, persistent bottom navigation, dashboard footer, 27-question assessment, automatic scoring, domain results, report download, and local browser persistence.

## Run in VS Code

1. Open the `wellbeingcheck-frontend` folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Run:

```bash
npm install
npm run dev
```

4. Open the localhost address shown in the terminal, normally `http://localhost:5173`.

## Build for submission

```bash
npm run build
```

The finished production files will be generated in the `dist` folder.

## Demo login

Use any valid-looking email and any password containing at least 6 characters. This prototype stores data in `localStorage`; it does not send health information to a server.

## Backend handover

Replace the local storage functions near the top of `src/pages.jsx` with your team's API calls for authentication, assessments, results, and user history. Do not use this prototype's scoring thresholds or questions for real clinical use without review by an appropriately qualified professional.
