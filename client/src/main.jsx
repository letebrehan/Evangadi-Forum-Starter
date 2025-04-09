import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./Context/UserProvider.jsx";
import { QuestionProvider } from "./Context/QuestionProvider.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <QuestionProvider>
      <BrowserRouter basename="/">
        <StrictMode>
          <App />
        </StrictMode>
      </BrowserRouter>
    </QuestionProvider>
  </UserProvider>
);
