"use client";
// ROC primitive: an image that falls back to initials until it has loaded.
import * as React from "react";

type Status = "idle" | "loading" | "loaded" | "error";
const Context = React.createContext<{
  status: Status;
  setStatus: (status: Status) => void;
}>({ status: "idle", setStatus: () => {} });

function Root(props: React.ComponentProps<"span">) {
  const [status, setStatus] = React.useState<Status>("idle");
  return (
    <Context.Provider value={{ status, setStatus }}>
      <span {...props} />
    </Context.Provider>
  );
}

function useImageStatus(
  src: string | undefined,
  crossOrigin?: React.ImgHTMLAttributes<HTMLImageElement>["crossOrigin"],
  referrerPolicy?: React.ImgHTMLAttributes<HTMLImageElement>["referrerPolicy"],
) {
  const [status, setStatus] = React.useState<Status>("idle");
  React.useLayoutEffect(() => {
    if (!src) return setStatus("error");
    let mounted = true;
    const image = new window.Image();
    const settle = (next: Status) => () => mounted && setStatus(next);
    setStatus("loading");
    image.onload = settle("loaded");
    image.onerror = settle("error");
    image.src = src;
    if (crossOrigin) image.crossOrigin = crossOrigin;
    if (referrerPolicy) image.referrerPolicy = referrerPolicy;
    return () => {
      mounted = false;
    };
  }, [src, crossOrigin, referrerPolicy]);
  return status;
}

type ImageProps = React.ComponentProps<"img"> & {
  onLoadingStatusChange?: (status: Status) => void;
};

function Image({
  src,
  crossOrigin,
  referrerPolicy,
  onLoadingStatusChange,
  ...props
}: ImageProps) {
  const { setStatus } = React.useContext(Context);
  const status = useImageStatus(src, crossOrigin, referrerPolicy);
  React.useLayoutEffect(() => {
    if (status === "idle") return;
    onLoadingStatusChange?.(status);
    setStatus(status);
  }, [status]);
  // An unmounted image no longer counts as loaded, so the fallback can return.
  React.useLayoutEffect(() => () => setStatus("idle"), []);
  return status === "loaded" ? (
    <img {...props} src={src} crossOrigin={crossOrigin} referrerPolicy={referrerPolicy} />
  ) : null;
}

function Fallback({
  delayMs,
  ...props
}: React.ComponentProps<"span"> & { delayMs?: number }) {
  const { status } = React.useContext(Context);
  const [ready, setReady] = React.useState(delayMs === undefined);
  React.useEffect(() => {
    if (delayMs === undefined) return;
    const timer = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);
  return ready && status !== "loaded" ? <span {...props} /> : null;
}

export const Avatar = { Root, Image, Fallback };
