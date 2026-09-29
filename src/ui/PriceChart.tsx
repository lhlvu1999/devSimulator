import { useId } from "react";

/** Line and soft fill for a price series. Green when the last day rose, clay-red when it fell. */
export function PriceChart({
  series,
  large,
}: {
  series: readonly number[];
  large?: boolean;
}) {
  const gradient = useId();
  const width = 100;
  const height = large ? 56 : 28;
  const values = series.length > 1 ? series : [series[0] ?? 0, series[0] ?? 0];
  const low = Math.min(...values);
  const high = Math.max(...values);
  const span = high - low || 1;
  const pad = large ? 4 : 2;
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = pad + (1 - (value - low) / span) * (height - pad * 2);
    return [x, y] as const;
  });
  const line = points
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  const area = `0,${height} ${line} ${width},${height}`;
  const rising =
    (values[values.length - 1] ?? 0) >= (values[values.length - 2] ?? 0);
  const tone = rising ? "#6f8f5b" : "#e07a7a";

  return (
    <svg
      className={large ? "price-chart large" : "price-chart"}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.28" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>
      {large ? (
        <>
          <line x1="0" x2={width} y1={pad} y2={pad} className="chart-guide" />
          <line
            x1="0"
            x2={width}
            y1={height - pad}
            y2={height - pad}
            className="chart-guide"
          />
        </>
      ) : null}
      <polygon points={area} fill={`url(#${gradient})`} />
      <polyline
        points={line}
        fill="none"
        stroke={tone}
        strokeWidth={large ? 1.4 : 1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
