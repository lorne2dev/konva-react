import { useState, useRef } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Circle } from "react-konva";
import StyledButton from "./StyledButton";
import data from "./data";

const MOUSEONE = 0; // left mouse button
const MOUSETWO = 2; // right mouse button
const MOUSETHREE = 1; // middle mouse button
const POINT_SIZE = 10; // diameter of circle

let points = [];
for (let i = 0; i < data.length; i++) {
    points.push({
        id: i + 4,
        x: data[i].x - POINT_SIZE / 2,
        y: data[i].y - POINT_SIZE / 2,
        height: POINT_SIZE,
        width: POINT_SIZE,
        selected: false,
    });
}

const initialiseState = {
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

function App() {
    const [state, setState] = useState(initialiseState);
    const stageRef = useRef(null);

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

    const getSelectedPoints = () => {
        return state.points.filter((point) => point.selected);
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

    const getPointById = (id) => {
        return state.points.find((point) => point.id === id);
    };

    const mouseDown = (e) => {
        const stage = stageRef.current;
        const { target } = e;
        if (e.evt.button === MOUSEONE || e.evt.button === MOUSETWO) {
            if (target.name() === "circle") {
                const point = getPointById(target._id);
                deselectAllPoints();
                selectPoints([point.id]);
            }
            if (
                (e.evt.button === MOUSEONE &&
                    e.target.name() === "background") ||
                e.target.name() === "circle"
            ) {
                deselectAllPoints();
                const { x, y } = calculateOffset(
                    stage.getPointerPosition().x,
                    stage.getPointerPosition().y
                );
                const newState = {
                    ...state,
                    selection: {
                        visible: true,
                        x1: x,
                        y1: y,
                        x2: x,
                        y2: y,
                    },
                };
                setState(newState);
            }
        }
        if (e.evt.button === MOUSETHREE) {
            e.evt.preventDefault();
        }
    };

    const mouseMove = () => {
        const stage = stageRef.current;
        if (!state.selection.visible) {
            return;
        }
        const { x, y } = calculateOffset(
            stage.getPointerPosition().x,
            stage.getPointerPosition().y
        );
        const newState = {
            ...state,
            selection: {
                ...state.selection,
                x2: x,
                y2: y,
            },
        };
        setState(newState);
    };

    const mouseUp = () => {
        if (state.selection.visible) {
            const newState = {
                ...state,
                selection: {
                    ...state.selection,
                    visible: false,
                },
            };
            const selectionBox = generateSelectionBox();
            const selected = state.points.filter((point) => {
                return Konva.Util.haveIntersection(selectionBox, point);
            });
            deselectAllPoints();
            selectPoints(selected.map((a) => a.id));
            setState(newState);
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
            >
                <Layer>
                    <Rect
                        width={800}
                        height={600}
                        fill="#222"
                        name="background"
                    />
                </Layer>
                <Layer>
                    {state.points.map((point) => (
                        <Circle
                            key={point.id}
                            x={point.x + POINT_SIZE / 2}
                            y={point.y + POINT_SIZE / 2}
                            stroke={point.selected ? "#fff" : "#00ffff"}
                            radius={point.height / 2}
                            name="circle"
                        />
                    ))}
                </Layer>
                <Layer>
                    {state.selection.visible && (
                        <Rect
                            name="selection"
                            x={Math.min(state.selection.x1, state.selection.x2)}
                            y={Math.min(state.selection.y1, state.selection.y2)}
                            height={Math.abs(
                                state.selection.y2 - state.selection.y1
                            )}
                            width={Math.abs(
                                state.selection.x2 - state.selection.x1
                            )}
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
