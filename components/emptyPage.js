import React from "react";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const EmptyPage = () => {
  const bgColor = getRandomColor();

  return (
    <div style={{ height: "100vh", backgroundColor: bgColor }}>
    </div>
  );
};

export default EmptyPage;