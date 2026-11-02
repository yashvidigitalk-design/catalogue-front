'use client';

import { useState, useMemo } from 'react';
import { SALES_TIMEFRAME_DATA } from '@/lib/dashboardData';
import { SalesTimeframe } from '@/types';

export default function SalesOverviewChart() {
  const [timeframe, setTimeframe] = useState<SalesTimeframe>('30d');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeData = SALES_TIMEFRAME_DATA[timeframe];
  const points = activeData.dataPoints;

  // Chart coordinates calculation
  const chartConfig = useMemo(() => {
    const width = 720;
    const height = 180;
    const paddingLeft = 14;
    const paddingRight = 14;
    const paddingTop = 32;
    const paddingBottom = 16;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    const maxValue = Math.max(...points.map((p) => p.value)) * 1.15;
    const minValue = 0;

    const coords = points.map((p, idx) => {
      const x = paddingLeft + (idx / (points.length - 1)) * plotWidth;
      const y = paddingTop + plotHeight - ((p.value - minValue) / (maxValue - minValue)) * plotHeight;
      return { x, y, ...p };
    });

    // Smooth Bezier curve generator
    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 2.5;
      const cpY1 = curr.y;
      const cpX2 = next.x - (next.x - curr.x) / 2.5;
      const cpY2 = next.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }

    const baselineY = paddingTop + plotHeight;
    const areaD = `${pathD} L ${coords[coords.length - 1].x} ${baselineY} L ${coords[0].x} ${baselineY} Z`;

    // Find peak point for static badge
    let peakIndex = 0;
    let maxVal = -Infinity;
    coords.forEach((c, i) => {
      if (c.value > maxVal) {
        maxVal = c.value;
        peakIndex = i;
      }
    });

    return {
      width,
      height,
      coords,
      pathD,
      areaD,
      paddingTop,
      paddingBottom,
      plotHeight,
      baselineY,
      peakCoord: coords[peakIndex],
    };
  }, [points]);

  return (
    <div className="bg-white border border-[#E2E1EC] rounded-xl p-5 sm:p-6 pb-6 shadow-[0_1px_3px_rgba(16,14,38,0.05)] flex flex-col justify-between">
      {/* Chart Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3
                className="text-lg font-bold text-[#100E26]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Sales Overview
              </h3>
              <span className="text-[11px] font-semibold text-[#4E45D5] bg-[#EEF2FF] px-2 py-0.5 rounded-md">
                Revenue Trend
              </span>
            </div>
            <p className="text-xs text-[#5A586E] mt-1 leading-normal">
              {activeData.dispatchedNote}
            </p>
          </div>

          {/* Timeframe Filter Tabs */}
          <div className="inline-flex items-center p-1 bg-[#F7F7FB] border border-[#E2E1EC] rounded-lg shrink-0">
            {(
              [
                { label: 'Last 7 Days', value: '7d' },
                { label: 'Last 30 Days', value: '30d' },
                { label: 'This Year', value: '1y' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setTimeframe(tab.value);
                  setHoveredIndex(null);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  timeframe === tab.value
                    ? 'bg-white text-[#100E26] shadow-xs border border-[#E2E1EC]/60'
                    : 'text-[#5A586E] hover:text-[#100E26]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Highlight Metrics */}
        <div className="mt-4 pt-3 border-t border-[#F1F0F7] grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9493A8] block">
              Peak Day Volume
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#100E26] font-tabular mt-0.5 block">
              {activeData.metrics.peakVolume}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9493A8] block">
              Avg Wholesale Lot
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#100E26] font-tabular mt-0.5 block">
              {activeData.metrics.avgLot}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9493A8] block">
              Payment Realized
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#059669] font-tabular mt-0.5 block">
              {activeData.metrics.paymentRealized}
            </span>
          </div>
        </div>
      </div>

      {/* SVG Smooth Area Chart & Labels */}
      <div className="mt-6 flex flex-col select-none">
        {/* Dedicated SVG Chart Container */}
        <div className="relative w-full h-44 sm:h-52">
          <svg
            viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4E45D5" stopOpacity="0.22" />
                <stop offset="70%" stopColor="#4E45D5" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#4E45D5" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Light Horizontal Grid Lines */}
            {[0.25, 0.6].map((ratio, idx) => {
              const lineY = chartConfig.paddingTop + chartConfig.plotHeight * ratio;
              return (
                <line
                  key={idx}
                  x1={14}
                  y1={lineY}
                  x2={chartConfig.width - 14}
                  y2={lineY}
                  stroke="#F1F0F7"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Baseline Line */}
            <line
              x1={14}
              y1={chartConfig.baselineY}
              x2={chartConfig.width - 14}
              y2={chartConfig.baselineY}
              stroke="#E2E1EC"
              strokeWidth="1"
            />

            {/* Area Fill */}
            <path d={chartConfig.areaD} fill="url(#areaGradient)" />

            {/* Accent Line */}
            <path
              d={chartConfig.pathD}
              fill="none"
              stroke="#4E45D5"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Peak Value Badge */}
            {chartConfig.peakCoord && (
              <g
                transform={`translate(${chartConfig.peakCoord.x}, ${chartConfig.peakCoord.y - 14})`}
                className="pointer-events-none"
              >
                <rect
                  x="-26"
                  y="-18"
                  width="52"
                  height="18"
                  rx="5"
                  fill="#100E26"
                  className="shadow-sm"
                />
                <text
                  x="0"
                  y="-5"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#FFFFFF"
                  fontFamily="Inter, sans-serif"
                >
                  {chartConfig.peakCoord.formatted}
                </text>
                <polygon points="0,-1 -3,-5 3,-5" fill="#100E26" />
                <circle cx="0" cy="14" r="5" fill="#FFFFFF" stroke="#4E45D5" strokeWidth="2.5" />
              </g>
            )}

            {/* Interactive Data Point Dots and Hover Trigger Bars */}
            {chartConfig.coords.map((c, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Transparent hit area */}
                  <rect
                    x={c.x - 20}
                    y={chartConfig.paddingTop}
                    width="40"
                    height={chartConfig.plotHeight + 10}
                    fill="transparent"
                  />

                  {isHovered && (
                    <>
                      <line
                        x1={c.x}
                        y1={chartConfig.paddingTop}
                        x2={c.x}
                        y2={chartConfig.baselineY}
                        stroke="#4E45D5"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                      <circle cx={c.x} cy={c.y} r="6" fill="#4E45D5" stroke="#FFFFFF" strokeWidth="2.5" />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredIndex !== null && chartConfig.coords[hoveredIndex] && (
            <div
              className="absolute z-20 pointer-events-none -translate-x-1/2 bg-[#100E26] text-white px-2.5 py-1.5 rounded-lg shadow-lg text-xs"
              style={{
                left: `${(chartConfig.coords[hoveredIndex].x / chartConfig.width) * 100}%`,
                top: `${Math.max(5, (chartConfig.coords[hoveredIndex].y / chartConfig.height) * 100 - 45)}%`,
              }}
            >
              <div className="text-[10px] text-[#A9A7C0]">{chartConfig.coords[hoveredIndex].label}</div>
              <div className="font-bold text-white font-tabular">{chartConfig.coords[hoveredIndex].formatted}</div>
            </div>
          )}
        </div>

        {/* X-Axis Labels with Proper Top and Bottom Margin */}
        <div className="flex justify-between items-center px-1 pt-3 pb-1 text-[11px] font-medium text-[#9493A8] select-none">
          {points.map((p, idx) => (
            <span key={idx} className="truncate">
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
