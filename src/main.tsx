import { createRoot } from "react-dom/client";
import { AnimateUIProvider } from "@animate-ui/react/provider";
import { App } from "./App";
createRoot(document.getElementById("root")!).render(<AnimateUIProvider reducedMotion="user"><App /></AnimateUIProvider>);
