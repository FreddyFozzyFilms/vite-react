import React, { MouseEventHandler, useState } from 'react';

function DragButton() {
  const [count, setCount] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startDragging : MouseEventHandler = (event) => {
    setStartX(event.clientX);
    setIsDragging(true);
  };

  const stopDragging : MouseEventHandler= () => {
    setIsDragging(false);
  };

  const handleDragging : MouseEventHandler = (event) => {
    if (isDragging) {
      const currentX = event.clientX;
      const diffX = currentX - startX;

      if (diffX > 10) {
        // Dragging to the right, increase count by 1
        setCount((prevCount) => prevCount + 1);
        setStartX(currentX);
        setIsDragging(false); // Stop further dragging until next mousedown
      } else if (diffX < -10) {
        // Dragging to the left, decrease count by 1
        setCount((prevCount) => prevCount - 1);
        setStartX(currentX);
        setIsDragging(false); // Stop further dragging until next mousedown
      }
    }
  };

  return (
    <div>
      <button
        id="dragButton"
        onMouseDown={startDragging}
        onMouseUp={stopDragging}
        onMouseMove={handleDragging}
      >
        Drag Me
      </button>
      <p>Count: {count}</p>
    </div>
  );
}

export default DragButton;
