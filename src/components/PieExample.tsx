import React from "react";
import browserUsage, {
  BrowserUsage as Browsers,
} from "@visx/mock-data/lib/mocks/browserUsage";
import { GradientPurpleOrange } from "@visx/gradient";
import { Group } from "@visx/group";
import { Pie } from "@visx/shape";
// import { scaleOrdinal } from "@visx/scale";
import { Text } from "@visx/text";

type BrowserNames = keyof Browsers;

interface BrowserUsage {
  label: BrowserNames;
  usage: number;
}

const browserNames = Object.keys(browserUsage[0]).filter(
  (k) => k !== "date"
) as BrowserNames[];

const browsers: BrowserUsage[] = browserNames.map((name) => ({
  label: name,
  usage: Number(browserUsage[0][name]),
}));

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

// Accessors
const usage = (d: BrowserUsage) => d.usage;

export type PieProps = {
  width: number;
  height: number;
  margin?: typeof defaultMargin;
  animate?: boolean;
};

// color scales
// const getBrowserColor = scaleOrdinal({
//   domain: browserNames,
//   range: [
//     "rgba(255,255,255,0.1)",
//     "rgba(255,255,255,0.2)",
//     "rgba(255,255,255,0.3)",
//     "rgba(255,255,255,0.4)",
//     "rgba(255,255,255,0.5)",
//     "rgba(255,255,255,0.6)",
//     "rgba(255,255,255,0.8)",
//   ],
// });

export function PieExample({
  width,
  height,
  margin = defaultMargin,
}: PieProps) {
  const [active, setActive] = React.useState<BrowserUsage | null>(null);
  if (width < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2 - 20;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const donutThickness = 60;

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <GradientPurpleOrange id="visx-pie-gradient" />
        <rect
          rx={14}
          width={width}
          height={height}
          fill="url('#visx-pie-gradient')"
        />

        <Group top={centerY + margin.top} left={centerX + margin.left}>
          <Pie
            data={browsers}
            pieValue={usage}
            outerRadius={({ data }) => {
              return active && active.label == data.label ? radius + 5 : radius;
            }}
            innerRadius={({ data }) => {
              return active && active.label == data.label
                ? radius - donutThickness - 5
                : radius - donutThickness;
            }}
            cornerRadius={3}
            padAngle={0.01}
          >
            {(pie) => {
              return pie.arcs.map((arc) => {
                const [centroidX, centroidY] = pie.path.centroid(arc);
                const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

                return (
                  <g
                    key={arc.data.label}
                    onMouseEnter={() => setActive(arc.data)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <path
                      d={pie.path(arc) ?? undefined}
                      fill={
                        active && active.label == arc.data.label
                          ? "rgba(255,255,255, 0.8)"
                          : "rgba(255,255,255,0.6)"
                      }
                    ></path>
                    {hasSpaceForLabel && (
                      <Text
                        fill="#fff"
                        x={centroidX}
                        y={centroidY}
                        dy=".33em"
                        fontSize={10}
                        fontFamily="helvetica"
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {arc.data.label}
                      </Text>
                    )}
                  </g>
                );
              });
            }}
          </Pie>
          {active ? (
            <>
              <Text
                textAnchor="middle"
                fontFamily="helvetica"
                fill="rgba(255,255,255, 0.8)"
                fontSize={24}
                dy={12}
              >
                {active.label}
              </Text>

              <Text
                fontFamily="helvetica"
                textAnchor="middle"
                fill="#aaa"
                fontSize={16}
                dy={30}
              >
                {`${active.usage}%`}
              </Text>
            </>
          ) : (
            <>
              <Text
                textAnchor="middle"
                fill="rgba(255,255,255, 0.8)"
                fontSize={24}
                fontFamily="helvetica"
                dy={12}
              >
                {"Browser usage"}
              </Text>
            </>
          )}
        </Group>
      </svg>
    </div>
  );
}
