import React, { useEffect, useState } from "react";
import { Stage, Layer, Line, Group, Arrow, Text, Rect } from "react-konva";
import useMeasure from "react-use-measure";

const Whiteboard = ({ socket, roomId, user, color }) => {
  const [ref, bounds] = useMeasure();
  // State to hold the drawing paths

  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState([]);
  const [cursors, setCursors] = useState({});

  // Handle drawing start
  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    setCurrentLine([{ x, y }]);
  };

  // Handle drawing move
  const handleMouseMove = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    socket.emit("cursor-move", {
      roomId,
      x,
      y,
      user,
    });

    if (!currentLine.length) return;
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

  socket.on("cursor-move", ({ x, y, user }) => {
    setCursors((prevCursors) => ({
      ...prevCursors,
      [user]: { x, y }, // Update or add the user's cursor position
    }));
  });

  console.log(cursors);
  console.log(color);

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
          {Object.keys(cursors).map((user) => (
            <Group key={user}>
              <Arrow
                points={[
                  cursors[user].x + 10,
                  cursors[user].y + 10,
                  cursors[user].x,
                  cursors[user].y,
                ]}
                pointerLength={10}
                pointerWidth={10}
                fill={color}
                stroke={color}
              />
              <Rect
                x={cursors[user].x + 12}
                y={cursors[user].y + 12}
                width={user.length * 7}
                height={20}
                fill={color}
                cornerRadius={5}
              />
              <Text
                x={cursors[user].x + 15}
                y={cursors[user].y + 15}
                text={user}
                fontSize={12}
                fill="white"
              />
            </Group>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Whiteboard;
