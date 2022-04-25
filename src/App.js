import React, { useEffect, useState } from 'react';
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

const init = {
  points,
  stageOffset: {
    x: 0,
    y: 0,
  },
  selection: {
    visible: false,
    x1: null,
    y1: null,
    x2: null,
    y2: null,
  },
};

const stageRef = React.createRef();
const MOUSEONE = 0;
const MOUSETWO = 2;
const MOUSETHREE = 1;

function App() {
  const [state, setState] = useState(init);

  console.log('App rendered');
  console.log('points:', state);

  const calculateOffset = (x, y) => {
    return {
      x: x - state.stageOffset.x,
      y: y - state.stageOffset.y,
    };
  };

  const generateSelectionBox = () => {
    return {
      x: Math.min(state.selection.x1, state.selection.x2),
      y: Math.min(state.selection.y1, state.selection.y2),
      height: Math.abs(state.selection.y2 - state.selection.y1),
      width: Math.abs(state.selection.x2 - state.selection.x1),
    };
  };

  const getSelected = () => {
    return state.points.filter((point) => point.selected);
  };

  const getPointById = (id) => {
    return state.points.find((point) => {
      return point.id === id;
    });
  };

  const onBoxDragEnd = () => {
    const selected = getSelected();
    console.log(selected);
  };

  const deleteButtonHandler = () => {
    const newState = {
      ...state,
      points: state.points.filter((point) => !point.selected),
    };
    setState(newState);
  };

  const deselectAllPoints = () => {
    const deselectedPoints = [];
    state.points.forEach((point) => {
      point.selected = false;
      deselectedPoints.push(point);
    });
    const newState = {
      ...state,
      points: deselectedPoints,
    };
    setState(newState);
  };

  const selectPoints = (ids) => {
    state.points.forEach((point) => {
      if (ids.includes(point.id)) {
        point.selected = true;
      }
    });
  };

  const mouseDown = (e) => {
    // console.log('mouse down');
    const stage = stageRef.current;
    const { target } = e;

    if (e.evt.button === MOUSEONE || e.evt.button === MOUSETWO) {
      if (target.name() === 'circle') {
        const point = getPointById(target.index);
        if (!point.selected) {
          deselectAllPoints();
          selectPoints([point.id]);
        }
      }

      if (e.evt.button === MOUSEONE) {
        if (e.target.name() === 'background') {
          // console.log('background clicked');
          const { x, y } = calculateOffset(
            stage.getPointerPosition().x,
            stage.getPointerPosition().y
          );
          return {
            ...state,
            selection: {
              visible: true,
              x1: x,
              y1: y,
              x2: x,
              y2: y,
            },
          };
        }
      }
    }
    if (e.evt.button === MOUSETHREE) {
      e.evt.preventDefault();
    }
  };

  const mouseMove = () => {
    // console.log('mouse move', selectionState.selection.visible);
    const stage = stageRef.current;
    if (!state.selection.visible) {
      return;
    }

    const { x, y } = calculateOffset(
      stage.getPointerPosition().x,
      stage.getPointerPosition().y
    );

    const result = {
      ...state,
      selection: {
        x2: x,
        y2: y,
      },
    };
    // console.log(result);
    return result;
  };

  const mouseUp = () => {
    // console.log('mouse up', selectionState.selection.visible);
    if (state.selection.visible) {
      // this.setState({
      //   selection: {
      //     ...this.state.selection,
      //     visible: false,
      //   },
      // });

      const selectionBox = generateSelectionBox();
      const selected = state.points.filter((point) => {
        return Konva.Util.haveIntersection(selectionBox, point);
      });
      deselectAllPoints();
      selectPoints(selected.map((a) => a.id));
    }
  };

  return (
    <>
      <StyledButton id="delete-btn" onClick={deleteButtonHandler}>
        Delete
      </StyledButton>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onMouseDown={mouseDown}
        onMouseMove={mouseMove}
        onMouseUp={mouseUp}
        onDragEnd={onBoxDragEnd}
      >
        <Layer>
          <Rect width={800} height={600} fill="#222" name="background" />
        </Layer>
        <Layer>
          {state.points.map((point) => (
            <Circle
              key={point.id}
              x={point.x}
              y={point.y}
              stroke={point.selected ? '#fff' : '#00ffff'}
              radius={6}
              name="circle"
            />
          ))}
          {state.selection.visible && (
            <Rect
              name="selection"
              x={Math.min(state.selection.x1, state.selection.x2)}
              y={Math.min(state.selection.y1, state.selection.y2)}
              height={Math.abs(state.selection.y2 - state.selection.y1)}
              width={Math.abs(state.selection.x2 - state.selection.x1)}
              fill="teal"
              opacity={0.8}
              strokeWidth={1}
              stroke="blue"
            />
          )}
        </Layer>
      </Stage>
    </>
  );
}

export default App;
