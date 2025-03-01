import React from "react";
import ReactDOM from "react-dom/client"; // Use `react-dom/client` for React 18
import "./index.css";
import App from "./App";
import { TransactionProvider } from "./context/TransactionContext";

// Get the root element and assert it's not null
const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found");
}

// Create a root for rendering (React 18+)
const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
    <TransactionProvider>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </TransactionProvider>
);
