import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './Points.css';

export type IPointsDatum = {
    id: string;
    label: string | undefined;
    x: number;
    y: number;
}

export type IPointsData = IPointsDatum[]

export interface IPointsProps {
    data: IPointsData;
    selected: ISelectedIds;
    xScale: d3.ScaleLinear<number, number>;
    yScale: d3.ScaleLinear<number, number>;
    onMouseEnter: (item: IPointsDatum) => void;
    onMouseLeave: (item: IPointsDatum) => void;
}

export type ISelectedIds = Map<string, true>

export const Points = ({ data, xScale, yScale, selected, onMouseEnter, onMouseLeave }: IPointsProps) => {

    return (
        <g
            className="point-group"
        >
            <TransitionGroup
                component={null}
                appear={true}
                enter={true}
                exit={true}
            >
                {data.map((item) => {
                    const { x, y, id } = item;
                    return (
                        <CSSTransition
                            key={id}
                            timeout={300}
                            classNames="point"
                        >
                            <g
                                key={id}
                                className={`point ${selected.has(id) ? 'selected' : ''}`}
                                transform={`translate(${xScale(x)}, ${yScale(y)})`}
                            >
                                <circle
                                    onMouseEnter={(e) => {
                                        e.stopPropagation();
                                        onMouseEnter(item)
                                    }}
                                    onMouseLeave={(e) => {
                                        e.stopPropagation();
                                        onMouseLeave(item)
                                    }}
                                />
                            </g>
                        </CSSTransition>
                    );
                })}
            </TransitionGroup>
        </g >
    );
}
