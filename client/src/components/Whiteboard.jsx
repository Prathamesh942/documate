import React, { useEffect, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import useMeasure from "react-use-measure";

const Whiteboard = ({ socket, roomId }) => {
  const [ref, bounds] = useMeasure();
  // State to hold the drawing paths

  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState([]);

  // Handle drawing start
  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    setCurrentLine([{ x, y }]);
  };

  // Handle drawing move
  const handleMouseMove = (e) => {
    if (!currentLine.length) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    setCurrentLine([...currentLine, { x, y }]);
  };

  // Handle drawing end
  const handleMouseUp = () => {
    socket.emit("whiteboard-update", {
      roomId,
      line: currentLine,
    });
    setLines([...lines, currentLine]);
    setCurrentLine([]);
  };

  // useEffect(() => {
  //   socket.on("whiteboard-update", ({ line }) => {
  //     setLines([...lines, line]);
  //   });
  //   console.log(lines);
  // }, []);
  socket.on("whiteboard-update", ({ line }) => {
    setLines([...lines, line]);
  });
  // console.log(lines);

  return (
    <div
      className="flex-1 w-[100%] h-screen bg-white rounded-lg shadow-lg"
      ref={ref}
    >
      <Stage
        width={bounds.width}
        height={bounds.height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {lines.map((line, index) => (
            <Line
              key={index}
              points={line.flatMap((p) => [p.x, p.y])}
              stroke="black"
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          {currentLine.length > 0 && (
            <Line
              points={currentLine.flatMap((p) => [p.x, p.y])}
              stroke="black"
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Whiteboard;
