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
            "roc-s-222f930b8752 roc-s-63cd60faa2e1 roc-s-a503dd374cca roc-s-3992de70b033 roc-s-f1f3e4d6fda5 roc-s-6795c2f7a311 roc-s-250d66e6d4f0 roc-s-4410323c06ff roc-s-672352df819d roc-s-3782fa9cdd41 roc-s-f2fd46a5be56 roc-s-672554fba49d roc-s-e5d9a3964f33 roc-s-40cdab5541e8 roc-s-af9224c80039 roc-s-1a8eb218db68",
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
          className={cn("roc-shadcn", cn("roc-s-daaac3fbf55e", labelClassName))}
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
        className={cn("roc-shadcn", cn("roc-s-daaac3fbf55e", labelClassName))}
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
          "roc-s-0f2a693e93e2 roc-s-e9ab1547c94d roc-s-b9677bd1cb66 roc-s-70007b876865 roc-s-49abc543ea42 roc-s-4f1a55de40bc roc-s-163a623b3716 roc-s-5b272f3c5076 roc-s-588daa1a9891 roc-s-a8c1dfb1d4ef roc-s-3992de70b033 roc-s-dd3cce628256",
          className,
        ),
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div
        className={cn("roc-shadcn", "roc-s-0f2a693e93e2 roc-s-70007b876865")}
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
                    "roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-faa8a23c68f6 roc-s-30862f3b959a roc-s-074569488cca roc-s-77d49873eca6 roc-s-dde011342fb5 roc-s-019fd73c95db",
                    indicator === "dot" && "roc-s-71556df3b421",
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
                              "roc-s-27ead27a81df roc-s-45d69f0da1d1 roc-s-83c8b3c3c003 roc-s-51ace8da891d",
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
                          "roc-s-222f930b8752 roc-s-7bd5bab6d7f4 roc-s-32c92bb1fde4 roc-s-761cdb81bddb",
                          nestLabel
                            ? "roc-s-0ccd70f0f8e5"
                            : "roc-s-71556df3b421",
                        ),
                      )}
                    >
                      <div
                        className={cn(
                          "roc-shadcn",
                          "roc-s-0f2a693e93e2 roc-s-70007b876865",
                        )}
                      >
                        {nestLabel ? tooltipLabel : null}
                        <span
                          className={cn("roc-shadcn", "roc-s-35f35c41d134")}
                        >
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span
                          className={cn(
                            "roc-shadcn",
                            "roc-s-02ded9244507 roc-s-daaac3fbf55e roc-s-957a109f887f roc-s-ba2d0eea2e16",
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
          "roc-s-222f930b8752 roc-s-71556df3b421 roc-s-a503dd374cca roc-s-90fc3ec35a37",
          verticalAlign === "top" ? "roc-s-17b03732cf78" : "roc-s-0a702d97ed7d",
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
                  "roc-s-222f930b8752 roc-s-71556df3b421 roc-s-70007b876865 roc-s-4fb9d5b75392 roc-s-7a3e022703d8 roc-s-019fd73c95db",
                ),
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className={cn(
                    "roc-shadcn",
                    "roc-s-f5728694f674 roc-s-d4ea834145ae roc-s-27ead27a81df roc-s-45d69f0da1d1",
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
