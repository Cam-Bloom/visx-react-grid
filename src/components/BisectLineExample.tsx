import React from "react";
import appleStock, { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";
import {
  defaultStyles,
  useTooltip,
  TooltipWithBounds,
  Tooltip,
} from "@visx/tooltip";
import { timeFormat } from "@visx/vendor/d3-time-format";
import { max, extent, bisector } from "@visx/vendor/d3-array";
import { LinearGradient } from "@visx/gradient";
import { scaleTime, scaleLinear } from "@visx/scale";
import { curveMonotoneX } from "@visx/curve";
import { AreaClosed, Line, Bar } from "@visx/shape";
import { localPoint } from "@visx/event";
import { AxisBottom, AxisLeft } from "@visx/axis";

const stock = appleStock.slice(800);
export const background = "#3b6978";
export const background2 = "#204051";
export const accentColor = "#edffea";
export const accentColorDark = "#75daad";
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: "1px solid white",
  color: "white",
};

const defaultMargin = { top: 50, right: 50, bottom: 75, left: 75 };

// accessors
const getDate = (d: AppleStock) => new Date(d.date);
const getStockValue = (d: AppleStock) => d.close;
const bisectDate = bisector<AppleStock, Date>((d) => new Date(d.date)).left;

const formatDate = timeFormat(" %d-%b-%Y");

export function BisectLineExample({
  width,
  height,
  margin = defaultMargin,
}: {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}) {
  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<AppleStock>();

  // bounds
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // scales
  const dateScale = React.useMemo(
    () =>
      scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: extent(stock, getDate) as [Date, Date],
      }),
    [innerWidth, margin.left]
  );

  const stockValueScale = React.useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, (max(stock, getStockValue) || 0) + innerHeight / 3],
        nice: true,
      }),
    [margin.top, innerHeight]
  );

  // tooltip handler
  const handleTooltip = React.useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(stock, x0, 1);
      const d0 = stock[index - 1];
      const d1 = stock[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() >
          getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: stockValueScale(getStockValue(d)),
      });
    },
    [showTooltip, stockValueScale, dateScale]
  );

  if (width < 10) return null;
  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#area-background-gradient)"
          rx={14}
        />
        <LinearGradient
          id="area-background-gradient"
          from={background}
          to={background2}
        />
        <LinearGradient
          id="area-gradient"
          from={accentColor}
          to={accentColor}
          toOpacity={0.1}
        />
        <AreaClosed<AppleStock>
          data={stock}
          x={(d) => dateScale(getDate(d)) ?? 0}
          y={(d) => stockValueScale(getStockValue(d)) ?? 0}
          yScale={stockValueScale}
          strokeWidth={1}
          stroke="url(#area-gradient)"
          fill="url(#area-gradient)"
          curve={curveMonotoneX}
        />
        <Bar
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          rx={14}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        <AxisBottom
          top={innerHeight + margin.top}
          scale={dateScale}
          label={"Date"}
          stroke={accentColor}
          tickStroke={accentColor}
          tickLabelProps={{ fill: accentColor }}
          labelProps={{
            fill: accentColor,
            textAnchor: "start",
            y: margin.bottom / 2,
            x: width / 2,
            fontSize: 12,
            paintOrder: "stroke",
          }}
        />
        <AxisLeft
          scale={stockValueScale}
          stroke={accentColor}
          left={margin.left}
          tickStroke={accentColor}
          tickLabelProps={{ fill: accentColor }}
          label={"Close Price ($)"}
          labelProps={{
            fill: accentColor,
            textAnchor: "middle",
            fontSize: 12,
            x: -height / 2,
          }}
        />

        {tooltipOpen && tooltipData && (
          <g>
            <LinearGradient
              width={width}
              height={height}
              id="tooltip-gradient"
              from={accentColor}
              to={accentColor}
            />
            <Line
              from={{ x: tooltipLeft, y: tooltipTop }}
              to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              stroke={accentColorDark}
              fill={accentColor}
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill={accentColorDark}
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>
      {tooltipOpen && tooltipData && (
        <div>
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop - 12}
            left={tooltipLeft + 12}
            style={tooltipStyles}
          >
            {`$${getStockValue(tooltipData)}`}
          </TooltipWithBounds>
          <Tooltip
            top={innerHeight + margin.top}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              minWidth: 72,
              textAlign: "center",
              transform: "translateX(-50%)",
            }}
          >
            {formatDate(getDate(tooltipData))}
          </Tooltip>
        </div>
      )}
    </div>
  );
}
