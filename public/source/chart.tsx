// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import * as RechartsPrimitive from "recharts";
import type { TooltipValueType } from "recharts";
// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;
const INITIAL_DIMENSION = { width: 320, height: 200 } as const;
type TooltipNameType = number | string;
export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | {
        color?: string;
        theme?: never;
      }
    | {
        color?: never;
        theme: Record<keyof typeof THEMES, string>;
      }
  )
>;
type ChartContextProps = {
  config: ChartConfig;
};
const ChartContext = React.createContext<ChartContextProps | null>(null);
function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}
function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
  initialDimension?: {
    width: number;
    height: number;
  };
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "roc-shadcn",
          cn(
            "roc-u-flex roc-u-aspect-video roc-u-justify-center roc-u-text-xs roc-u-[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground roc-u-[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 roc-u-[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border roc-u-[&_.recharts-dot[stroke='#fff']]:stroke-transparent roc-u-[&_.recharts-layer]:outline-hidden roc-u-[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border roc-u-[&_.recharts-radial-bar-background-sector]:fill-muted roc-u-[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted roc-u-[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border roc-u-[&_.recharts-sector]:outline-hidden roc-u-[&_.recharts-sector[stroke='#fff']]:stroke-transparent roc-u-[&_.recharts-surface]:outline-hidden",
            className,
          ),
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RetainedChartSize initialDimension={initialDimension}>
          {children}
        </RetainedChartSize>
      </div>
    </ChartContext.Provider>
  );
}
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme ?? config.color,
  );
  if (!colorConfig.length) {
    return null;
  }
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};
const ChartTooltip = RechartsPrimitive.Tooltip;
function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >) {
  const { config } = useChart();
  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }
    const [item] = payload;
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label;
    if (labelFormatter) {
      return (
        <div
          className={cn("roc-shadcn", cn("roc-u-font-medium", labelClassName))}
        >
          {labelFormatter(value, payload)}
        </div>
      );
    }
    if (!value) {
      return null;
    }
    return (
      <div
        className={cn("roc-shadcn", cn("roc-u-font-medium", labelClassName))}
      >
        {value}
      </div>
    );
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);
  if (!active || !payload?.length) {
    return null;
  }
  const nestLabel = payload.length === 1 && indicator !== "dot";
  return (
    <div
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-grid roc-u-min-w-[8rem] roc-u-items-start roc-u-gap-1.5 roc-u-rounded-lg roc-u-border roc-u-border-border/50 roc-u-bg-background roc-u-px-2.5 roc-u-py-1.5 roc-u-text-xs roc-u-shadow-xl",
          className,
        ),
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div
        className={cn("roc-shadcn", "roc-u-grid roc-u-gap-1.5")}
      >
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color ?? item.payload?.fill ?? item.color;
            return (
              <div
                key={index}
                className={cn(
                  "roc-shadcn",
                  cn(
                    "roc-u-flex roc-u-w-full roc-u-flex-wrap roc-u-items-stretch roc-u-gap-2 roc-u-[&>svg]:h-2.5 roc-u-[&>svg]:w-2.5 roc-u-[&>svg]:text-muted-foreground",
                    indicator === "dot" && "roc-u-items-center",
                  ),
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "roc-shadcn",
                            cn(
                              "roc-u-shrink-0 roc-u-rounded-[2px] roc-u-border-(--color-border) roc-u-bg-(--color-bg)",
                              {
                                "h-2.5 w-2.5": indicator === "dot",
                                "w-1": indicator === "line",
                                "w-0 border-[1.5px] border-dashed bg-transparent":
                                  indicator === "dashed",
                                "my-0.5": nestLabel && indicator === "dashed",
                              },
                            ),
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "roc-shadcn",
                        cn(
                          "roc-u-flex roc-u-flex-1 roc-u-justify-between roc-u-leading-none",
                          nestLabel
                            ? "roc-u-items-end"
                            : "roc-u-items-center",
                        ),
                      )}
                    >
                      <div
                        className={cn(
                          "roc-shadcn",
                          "roc-u-grid roc-u-gap-1.5",
                        )}
                      >
                        {nestLabel ? tooltipLabel : null}
                        <span
                          className={cn("roc-shadcn", "roc-u-text-muted-foreground")}
                        >
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span
                          className={cn(
                            "roc-shadcn",
                            "roc-u-font-mono roc-u-font-medium roc-u-text-foreground roc-u-tabular-nums",
                          )}
                        >
                          {typeof item.value === "number"
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
const ChartLegend = RechartsPrimitive.Legend;
function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean;
  nameKey?: string;
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart();
  if (!payload?.length) {
    return null;
  }
  return (
    <div
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-items-center roc-u-justify-center roc-u-gap-4",
          verticalAlign === "top" ? "roc-u-pb-3" : "roc-u-pt-3",
          className,
        ),
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          return (
            <div
              key={index}
              className={cn(
                "roc-shadcn",
                cn(
                  "roc-u-flex roc-u-items-center roc-u-gap-1.5 roc-u-[&>svg]:h-3 roc-u-[&>svg]:w-3 roc-u-[&>svg]:text-muted-foreground",
                ),
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className={cn(
                    "roc-shadcn",
                    "roc-u-h-2 roc-u-w-2 roc-u-shrink-0 roc-u-rounded-[2px]",
                  )}
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}
// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }
  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;
  let configLabelKey: string = key;
  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }
  return configLabelKey in config ? config[configLabelKey] : config[key];
}
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};

import "./chart.css";

// Ignore zero-size observations while a gallery host hides this retained chart.
function RetainedChartSize({
  initialDimension = INITIAL_DIMENSION,
  children,
}: {
  initialDimension?: { width: number; height: number };
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState(initialDimension);
  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const width = element.clientWidth,
        height = element.clientHeight;
      if (width > 0 && height > 0)
        setSize((previous) =>
          previous.width === width && previous.height === height
            ? previous
            : { width, height },
        );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ width: "100%", height: "100%", minWidth: 0 }}>
      <RechartsPrimitive.ResponsiveContainer
        width={size.width}
        height={size.height}
      >
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  );
}
