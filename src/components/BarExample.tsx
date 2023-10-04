import React from "react";
import { Scale } from "@visx/visx";
import { Group } from "@visx/group";
import letterFrequency, {
  LetterFrequency,
} from "@visx/mock-data/lib/mocks/letterFrequency";
import { GradientTealBlue } from "@visx/gradient";
import { Bar } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { useTooltip, Tooltip, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";

const data: LetterFrequency[] = letterFrequency.slice(15);
const verticalMargin = 120;

// accessors
const getLetter = (d: LetterFrequency) => d.letter;
const getLetterFrequency = (d: LetterFrequency) => Number(d.frequency) * 100;

const tooltipStyles = {
  ...defaultStyles,
  borderRadius: 4,
  background: "black",
  color: "white",
  opacity: 0.9,
};

export const BarExample = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop,
  } = useTooltip<LetterFrequency>();

  // bounds
  const yMax = height - verticalMargin;
  const xMax = width - 100;

  // scales
  const xScale = React.useMemo(
    () =>
      Scale.scaleBand({
        range: [0, xMax],
        domain: data.map(getLetter),
        padding: 0.4,
        round: true,
      }),
    [xMax]
  );

  const yScale = React.useMemo(
    () =>
      Scale.scaleLinear<number>({
        range: [yMax, 0],
        domain: [0, Math.max(...data.map(getLetterFrequency))],
        round: true,
      }),
    [yMax]
  );

  return width < 10 ? null : (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <GradientTealBlue id="teal" />
        <rect width={width} height={height} fill="#fff" rx={14} />

        <Group top={verticalMargin / 2} left={50}>
          <Group width={width}>
            {data.map((d) => {
              const letter = getLetter(d);
              const barWidth = xScale.bandwidth();
              const barHeight = yMax - (yScale(getLetterFrequency(d)) ?? 0);
              const barX = xScale(letter);
              const barY = yMax - barHeight;
              return (
                <Bar
                  key={`bar-${letter}`}
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill="#0B615F"
                  onMouseOver={(event) => {
                    const coords = localPoint(event);
                    if (!coords) return;

                    showTooltip({
                      tooltipLeft: coords.x - 50,
                      tooltipTop: coords.y,
                      tooltipData: d,
                    });
                  }}
                  onMouseOut={hideTooltip}
                />
              );
            })}
          </Group>
          <Group>
            <AxisBottom numTicks={15} top={yMax} scale={xScale} />
          </Group>
          <Group>
            <AxisLeft scale={yScale} />
          </Group>
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <Tooltip
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div>
            <strong>{getLetter(tooltipData)}</strong>
          </div>
          <div>{Math.floor(getLetterFrequency(tooltipData))}%</div>
        </Tooltip>
      )}
    </div>
  );
};
