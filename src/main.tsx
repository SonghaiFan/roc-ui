import { createRoot } from "react-dom/client";
import { RocMotionProvider } from "../registry/roc/motion-config";
import { App } from "./App";
createRoot(document.getElementById("root")!).render(<RocMotionProvider><App /></RocMotionProvider>);
