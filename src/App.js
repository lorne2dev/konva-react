import React from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Circle } from "react-konva";
import StyledButton from "./StyledButton";
import data from "./data";

const MOUSE_LEFT_BTN = 0;
const MOUSE_MIDDLE_BTN = 1;
const MOUSE_RIGHT_BTN = 2;
const POINT_SIZE = 10; // diameter of circle

class CrossSectionViewer extends React.Component {
    constructor(props) {
        super(props);
        this.stage = React.createRef();
        const points = [];
        for (let i = 0; i < data.length; i++) {
            points.push({
                id: i.toString(),
                x: data[i].x - POINT_SIZE / 2,
                y: data[i].y - POINT_SIZE / 2,
                height: POINT_SIZE,
                width: POINT_SIZE,
                selected: false,
            });
        }
        this.state = {
            points,
            drag: false,
            pan: false,
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
    }

    calculateOffset = (x, y) => {
        return {
            x: x - this.state.stageOffset.x,
            y: y - this.state.stageOffset.y,
        };
    };

    generateSelectionBox = () => {
        return {
            x: Math.min(this.state.selection.x1, this.state.selection.x2),
            y: Math.min(this.state.selection.y1, this.state.selection.y2),
            height: Math.abs(this.state.selection.y2 - this.state.selection.y1),
            width: Math.abs(this.state.selection.x2 - this.state.selection.x1),
        };
    };

    getSelectedPoints = () => {
        return this.state.points.filter((point) => point.selected);
    };

    deselectAllPoints = (theState) => {
        const newPoints = theState.points.map((point) => {
            point.selected = false;
            return point;
        });
        this.setState({ points: newPoints });
    };

    selectPoints = (ids) => {
        this.state.points.forEach((point) => {
            if (ids.includes(point.id)) {
                point.selected = true;
            }
        });
    };

    deleteButtonHandler = () => {
        this.setState({
            points: this.state.points.filter((point) => !point.selected),
        });
    };

    resetButtonHandler = () => {
        this.deselectAllPoints(this.state);
    };

    getPointById = (id) => {
        return this.state.points.find((point) => point.id === id);
    };

    mouseDown = (e) => {
        const stage = this.stage.current;
        const { target } = e;
        if (e.evt.button === MOUSE_LEFT_BTN) {
            if (target.name() === "circle") {
                const point = this.getPointById(target.id());
                this.deselectAllPoints(this.state);
                this.selectPoints([point.id]);
            }
            if (
                (e.evt.button === MOUSE_LEFT_BTN &&
                    e.target.name() === "background") ||
                e.target.name() === "circle"
            ) {
                this.deselectAllPoints(this.state);
                const { x, y } = this.calculateOffset(
                    stage.getPointerPosition().x,
                    stage.getPointerPosition().y
                );
                this.setState({
                    pan: false,
                    selection: {
                        visible: true,
                        x1: x,
                        y1: y,
                        x2: x,
                        y2: y,
                    },
                });
            }
        }
        if (e.evt.button === MOUSE_MIDDLE_BTN) {
            e.evt.preventDefault();
            this.setState({
                drag: true,
                pan: true,
            });
        }
        if (e.evt.button === MOUSE_RIGHT_BTN) {
            e.evt.preventDefault();
            this.setState({
                pan: false,
            });
        }
    };

    mouseMove = () => {
        const stage = this.stage.current;
        if (!this.state.selection.visible) {
            return;
        }
        const { x, y } = this.calculateOffset(
            stage.getPointerPosition().x,
            stage.getPointerPosition().y
        );
        this.setState({
            selection: {
                ...this.state.selection,
                x2: x,
                y2: y,
            },
        });
    };

    mouseUp = () => {
        if (this.state.selection.visible) {
            const selectionBox = this.generateSelectionBox();
            const selected = this.state.points.filter((point) => {
                return Konva.Util.haveIntersection(selectionBox, point);
            });
            this.deselectAllPoints(this.state);
            this.selectPoints(selected.map((a) => a.id));
            this.setState({
                selection: {
                    ...this.state.selection,
                    visible: false,
                },
            });
        }
        this.setState({
            drag: false,
        });
    };

    onClick = (e) => {};

    getPanningState = () => {
        if (this.state.pan) {
            if (this.state.drag) {
                return "grabbing";
            }
            return "grab";
        }
        return "default";
    };

    onStageDrag = (e) => {
        if (this.state.grab) {
            this.setState({
                stageOffset: {
                    x: e.target.x(),
                    y: e.target.y(),
                },
            });
        }
    };

    onStageDragEnd = (e) => {
        if (this.state.pan) {
            this.setState({ grab: false });
        }
    };

    render() {
        return (
            <div style={{ cursor: this.getPanningState() }}>
                <StyledButton
                    id="delete-btn"
                    onClick={this.deleteButtonHandler}
                >
                    Delete
                </StyledButton>
                <StyledButton id="reset-btn" onClick={this.resetButtonHandler}>
                    Reset
                </StyledButton>
                <Stage
                    width={window.innerWidth}
                    height={window.innerHeight}
                    ref={this.stage}
                    onClick={this.onClick}
                    onMouseDown={this.mouseDown}
                    onMouseMove={this.mouseMove}
                    onMouseUp={this.mouseUp}
                    draggable={this.state.pan}
                    onDragMove={this.onStageDrag}
                    onDragEnd={this.onStageDragEnd}
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
                        {this.state.points.map((point) => (
                            <Circle
                                key={point.id}
                                id={point.id}
                                x={point.x + POINT_SIZE / 2}
                                y={point.y + POINT_SIZE / 2}
                                stroke={point.selected ? "#fff" : "#00ffff"}
                                radius={point.height / 2}
                                name="circle"
                            />
                        ))}
                    </Layer>
                    <Layer>
                        {this.state.selection.visible && (
                            <Rect
                                name="selection"
                                x={Math.min(
                                    this.state.selection.x1,
                                    this.state.selection.x2
                                )}
                                y={Math.min(
                                    this.state.selection.y1,
                                    this.state.selection.y2
                                )}
                                height={Math.abs(
                                    this.state.selection.y2 -
                                        this.state.selection.y1
                                )}
                                width={Math.abs(
                                    this.state.selection.x2 -
                                        this.state.selection.x1
                                )}
                                fill="teal"
                                opacity={0.8}
                                strokeWidth={1}
                                stroke="blue"
                            />
                        )}
                    </Layer>
                </Stage>
            </div>
        );
    }
}

export default CrossSectionViewer;
