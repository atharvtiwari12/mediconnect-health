import React from "react";
import "./RanDom.css";
const GridContainer = () => {
  // Logic to generate random grid sizes
  const generateRandomSizes = (numItems) => {
    const sizes = [];
    for (let i = 0; i < numItems; i++) {
      const randomSize = Math.floor(Math.random() * 3) + 1; // Generates 1, 2, or 3
      sizes.push(randomSize);
    }
    return sizes;
  };

  const numItems = 12; // Number of grid items
  const gridSizes = generateRandomSizes(numItems);

  return (
    <div className="grid-container">
      {Array.from({ length: numItems }, (_, index) => (
        <div
          key={index}
          className="grid-item"
          style={{
            gridColumn: `span ${gridSizes[index]}`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default GridContainer;
