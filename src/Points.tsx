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
}

export type ISelectedIds = Set<string>

export const Points = ({ data, xScale, yScale, selected }: IPointsProps) => {

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
                    if (selected.has(id)) {
                        return null
                    } else {
                        return (
                            <CSSTransition
                                key={id}
                                timeout={300}
                                classNames="point"
                            >
                                <g
                                    key={id}
                                    className="point"
                                    transform={`translate(${xScale(x)}, ${yScale(y)})`}
                                >
                                    <circle />
                                </g>
                            </CSSTransition>
                        );
                    }
                })}
            </TransitionGroup>
        </g >
    );
}
