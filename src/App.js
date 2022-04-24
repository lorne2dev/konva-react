import { useEffect, useState } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import StyledButton from './StyledButton';
import data from './data';

let points = [];
for (let i = 0; i < data.length; i++) {
  points.push({
    id: i,
    x: data[i].x,
    y: data[i].y,
    selected: false,
  });
}
points[0].selected = true;
points[2].selected = true;

const getSelected = () => {
  return points.filter((point) => point.selected);
};

const mouseDown = () => {
  console.log('mouse down');
};

const mouseMove = () => {
  console.log('mouse move');
};

const mouseUp = () => {
  console.log('mouse up');
};

// const selectShapes = () => {};

// const onBoxDragEnd = () => {
//   const selected = getSelected();
//   console.log(selected);
// };

function App() {
  const [pointsState, setPointsState] = useState(points);

  const deleteButtonHandler = () => {
    const unselectedPoints = points.filter((point) => !point.selected);
    setPointsState(unselectedPoints);
  };

  return (
    <>
      <StyledButton id="delete-btn" onClick={deleteButtonHandler}>
        Delete
      </StyledButton>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        // onMouseDown={mouseDown}
        // onMouseMove={mouseMove}
        // onMouseUp={mouseUp}
      >
        <Layer>
          <Rect width={800} height={600} fill="#222" />
        </Layer>
        <Layer>
          {pointsState.map((point, index) => (
            <Circle
              key={index}
              x={point.x}
              y={point.y}
              stroke={point.selected ? '#fff' : '#00ffff'}
              radius={6}
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
}

export default App;
