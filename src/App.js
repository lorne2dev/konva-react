import Konva from 'konva';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import styled from 'styled-components';
import points from './data';

const Button = styled.button`
  background-color: #0000ff;
  color: #fff;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 5px;
`;

function App() {
  return (
    <>
      <Button id="delete-btn">Delete</Button>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect width={800} height={600} fill="#222" />
        </Layer>
        <Layer>
          {points.map((point, index) => (
            <Circle
              key={index}
              x={point.x}
              y={point.y}
              stroke="#00ffff"
              radius={6}
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
}

export default App;
