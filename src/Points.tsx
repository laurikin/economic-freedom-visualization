import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './Points.css';

export type IPointsData = {
    id: string;
    label: string | undefined;
    x: number;
    y: number;
}[]

export interface IPointsProps {
    data: IPointsData;
    selected: boolean[];
    xScale: d3.ScaleLinear<number, number>;
    yScale: d3.ScaleLinear<number, number>;
    onMouseEnter: (ind: number) => void;
    onMouseLeave: (ind: number) => void;
}

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
                {data.map(({ x, y, id }, i) =>
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
                            <circle
                                className={`${selected[i] === true ? 'selected' : ''}`}
                                onMouseEnter={() => onMouseEnter(i)}
                                onMouseLeave={() => onMouseLeave(i)}
                            />
                        </g>
                    </CSSTransition>
                )}
            </TransitionGroup>
        </g >
    );
}
