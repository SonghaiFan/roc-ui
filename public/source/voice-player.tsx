"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type HTMLAttributes,
  type CSSProperties,
} from "react";
import "./voice-player.css";

export type PlaybackGroup = Set<() => void>;
export const createPlaybackGroup = (): PlaybackGroup => new Set();
interface PlaybackState {
  playing: boolean;
  time: number;
  duration: number;
  rate: number;
  error: string;
  available: boolean;
  toggle: () => void;
  seek: (time: number) => void;
  setRate: (rate: number) => void;
}
const PlaybackContext = createContext<PlaybackState | null>(null);
export function useVoicePlayer() {
  const value = useContext(PlaybackContext);
  if (!value) throw new Error("Voice controls must be inside VoicePlayerRoot.");
  return value;
}
export interface VoicePlayerRootProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  group?: PlaybackGroup;
  children: ReactNode;
  onPlaybackChange?: (playing: boolean) => void;
}
/** React owns the controls and audio element. Media state stays with that element.
 * Consumers can compose these controls or supply their own with useVoicePlayer. */
export function VoicePlayerRoot({
  src,
  group,
  children,
  onPlaybackChange,
  className = "",
  ...props
}: VoicePlayerRootProps) {
  const audio = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState({
    playing: false,
    time: 0,
    duration: 0,
    rate: 1,
    error: "",
  });
  const callback = useRef(onPlaybackChange);
  callback.current = onPlaybackChange;
  const sync = () => {
    const a = audio.current;
    if (a)
      setState((s) => ({
        ...s,
        playing: !a.paused,
        time: a.currentTime,
        duration: Number.isFinite(a.duration) ? a.duration : 0,
        rate: a.playbackRate,
      }));
  };
  useEffect(() => {
    const a = audio.current!;
    const pause = () => a.pause();
    group?.add(pause);
    return () => {
      pause();
      group?.delete(pause);
    };
  }, [group]);
  useEffect(() => {
    setState({ playing: false, time: 0, duration: 0, rate: 1, error: "" });
  }, [src]);
  const fail = (error?: unknown) => {
    const name = error instanceof Error ? error.name : "";
    const message =
      name === "NotAllowedError"
        ? "Playback blocked. Press play to retry."
        : audio.current?.error?.code === 2
          ? "Unable to load audio. Press play to retry."
          : "Audio unavailable. Check the source and try again.";
    setState((s) => ({ ...s, error: message }));
  };
  const toggle = async () => {
    const a = audio.current;
    if (!a || !src) return;
    if (!a.paused) {
      a.pause();
      return;
    }
    setState((s) => ({ ...s, error: "" }));
    group?.forEach((pause) => pause());
    if (a.error) a.load();
    try {
      await a.play();
    } catch (error) {
      fail(error);
    }
  };
  return (
    <PlaybackContext.Provider
      value={{
        ...state,
        available: !!src,
        toggle,
        seek: (time) => {
          const a = audio.current;
          if (a && state.duration) {
            a.currentTime = Math.max(0, Math.min(state.duration, time));
            sync();
          }
        },
        setRate: (rate) => {
          if (audio.current) {
            audio.current.playbackRate = rate;
            sync();
          }
        },
      }}
    >
      <div
        {...props}
        className={`roc-voice ${className}`}
        data-state={
          state.error
            ? "error"
            : state.playing
              ? "playing"
              : src
                ? "ready"
                : "empty"
        }
      >
        <audio
          ref={audio}
          src={src}
          preload="metadata"
          hidden
          onPlay={() => {
            sync();
            callback.current?.(true);
          }}
          onPause={() => {
            sync();
            callback.current?.(false);
          }}
          onEnded={sync}
          onTimeUpdate={sync}
          onDurationChange={sync}
          onLoadedMetadata={sync}
          onRateChange={sync}
          onError={() => fail()}
        />
        {children}
        {state.error && (
          <span className="roc-voice-error" role="alert">
            {state.error}
          </span>
        )}
      </div>
    </PlaybackContext.Provider>
  );
}
const timeLabel = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
export function VoicePlayButton() {
  const s = useVoicePlayer();
  return (
    <button
      type="button"
      className="roc-voice-play"
      aria-label={s.playing ? "Pause audio" : "Play audio"}
      disabled={!s.available}
      onClick={s.toggle}
    >
      {s.playing ? "Ⅱ" : "▶"}
    </button>
  );
}
export function VoiceSeek() {
  const s = useVoicePlayer();
  return (
    <input
      className="roc-voice-seek"
      type="range"
      aria-label="Playback position"
      aria-valuetext={`${timeLabel(s.time)} of ${timeLabel(s.duration)}`}
      min={0}
      max={s.duration || 1}
      step={0.01}
      value={s.time}
      disabled={!s.duration}
      onChange={(e) => s.seek(Number(e.target.value))}
      style={
        {
          "--roc-progress": s.duration ? s.time / s.duration : 0,
        } as CSSProperties
      }
    />
  );
}
export function VoiceTime() {
  const s = useVoicePlayer();
  return (
    <span className="roc-voice-time">
      {s.available ? timeLabel(s.time || s.duration) : "No audio"}
    </span>
  );
}
export function VoiceRate({ rates = [1, 1.5, 2] }: { rates?: number[] }) {
  const s = useVoicePlayer();
  return (
    <button
      type="button"
      className="roc-voice-rate"
      aria-label={`Playback speed, ${s.rate} times`}
      disabled={!s.available || !rates.length}
      onClick={() =>
        s.setRate(rates[(rates.indexOf(s.rate) + 1) % rates.length])
      }
    >
      {s.rate}×
    </button>
  );
}
export interface VoicePlayerProps
  extends Omit<VoicePlayerRootProps, "children"> {
  label?: string;
}
export function VoicePlayer({
  label = "Audio player",
  ...props
}: VoicePlayerProps) {
  return (
    <VoicePlayerRoot role="group" aria-label={label} {...props}>
      <VoicePlayButton />
      <VoiceSeek />
      <VoiceTime />
      <VoiceRate />
    </VoicePlayerRoot>
  );
}
