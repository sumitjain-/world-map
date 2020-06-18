import React from "react";

export const Dot = () => (
  <span
    className="dot"
    style={{
      position: "absolute",
      width: 4,
      height: 4,
      background: "red",
      zIndex: 100,
      top: "50%",
      left: "50%"
    }}
  />
);
