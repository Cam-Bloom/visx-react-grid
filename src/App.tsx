import "./App.css";
// import { BarExample } from "./components/BarExample";
// import { BisectLineExample } from "./components/BisectLineExample";
// import { BisectWithBrushExample } from "./components/BisectWithBrushExample";
import { GridExample } from "./components/GridExample";
// import { PieExample } from "./components/PieExample";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <GridExample />
    </div>
  );
}

export default App;
