import React from "react";
import { MapContainer } from "./MapContainer";
import { cfg } from "./config";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <MapContainer {...cfg} />
    </div>
  );
}
