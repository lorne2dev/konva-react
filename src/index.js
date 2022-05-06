import { StrictMode } from "react";
import ReactDOM from "react-dom";

// import AppFunc from "./AppFunc"; // Prevents immediate middle mouse panning
import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
    <StrictMode>
        {/* <AppFunc /> */}
        <App />
    </StrictMode>,
    rootElement
);

// Prevents immediate middle mouse panning
/*
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App tab="home" />);
*/
