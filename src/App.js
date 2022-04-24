import { Stage, Layer, Rect, Circle } from 'react-konva';
import points from './data';

function App() {
  return (
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
  );
}

export default App;
