import { createRoot } from "react-dom/client";
import { RocMotionProvider, useRocReducedMotion, useRocTransition } from "./components/roc/motion-config";

function Probe({ label }: { label: string }) {
  const reduced = useRocReducedMotion();
  const transition = useRocTransition();
  return <p role="status">{label}: {reduced ? "reduced" : "full"}; {transition.duration === 0 ? "instant" : "spring"}</p>;
}
function PreferenceCheck() {
  return <main><h1>ROC isolated motion preference check</h1><p>This fixture simulates the browser media query. It does not change the device preference.</p>
    <button onClick={() => (window as Window & { setTestReducedMotion: (value: boolean) => void }).setTestReducedMotion(true)}>Simulate reduced motion</button>
    <button onClick={() => (window as Window & { setTestReducedMotion: (value: boolean) => void }).setTestReducedMotion(false)}>Simulate full motion</button>
    <Probe label="Without a provider" />
    <RocMotionProvider reducedMotion="always"><Probe label="Forced reduction" /></RocMotionProvider>
  </main>;
}
createRoot(document.getElementById("root")!).render(<PreferenceCheck />);
