import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import { PieExample } from "./PieExample";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { BisectLineExample } from "./BisectLineExample";
import { BarExample } from "./BarExample";

export function GridExample() {
  const layout = [
    { i: "a", x: 0, y: 1, w: 1, h: 2 },
    { i: "b", x: 0, y: 0, w: 2, h: 2 },
    { i: "c", x: 2, y: 0, w: 1, h: 2 },
    { i: "d", x: 0, y: 3, w: 2, h: 2 },
  ];

  const ResponsiveGridLayout = WidthProvider(Responsive);

  return (
    <ResponsiveGridLayout
      layouts={{ lg: layout }}
      breakpoints={{ lg: 1400, md: 1000, sm: 800 }}
      cols={{ lg: 4, md: 2, sm: 1 }}
      rowHeight={300}
      compactType="vertical"
      width={1000}
    >
      <div key="a">
        <ParentSize className="graph-container" debounceTime={10}>
          {({ width: visWidth, height: visHeight }) => (
            <PieExample width={visWidth} height={visHeight} />
          )}
        </ParentSize>
      </div>
      <div key="b">
        <ParentSize className="graph-container" debounceTime={10}>
          {({ width: visWidth, height: visHeight }) => (
            <BisectLineExample width={visWidth} height={visHeight} />
          )}
        </ParentSize>
      </div>
      <div style={{ backgroundColor: "red" }} key="c">
        c
      </div>
      <div key="d">
        <ParentSize className="graph-container" debounceTime={10}>
          {({ width: visWidth, height: visHeight }) => (
            <BarExample width={visWidth} height={visHeight} />
          )}
        </ParentSize>
      </div>
    </ResponsiveGridLayout>
  );
}
