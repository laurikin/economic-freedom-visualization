import React, { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './ScatterPlot.css';

export type IScatterPlotData = {
    id: string;
    label: string | undefined;
    x: number;
    y: number;
}[]

export interface IScatterPlotProps {
    data: IScatterPlotData;
    xDomain: [number, number];
    yDomain: [number, number];
}

export const ScatterPlot = ({ data, xDomain, yDomain }: IScatterPlotProps) => {

    const initialHoverIndex = null;
    const [hoverIndex, setHoverIndex] = useState(initialHoverIndex as (number | null))

    const xAxisGroup = useRef(null);
    const yAxisGroup = useRef(null);

    const margin = 60;
    const width = 600;
    const height = 500

    const xScale = useMemo(() => (
        d3.scaleLinear()
            .domain(xDomain)
            .range([0, width])
    ), [xDomain])

    const yScale = useMemo(() => (
        d3.scaleLinear()
            .domain(yDomain)
            .range([0, height])
    ), [yDomain])

    useEffect(() => {
        const xAxis = d3.axisBottom(xScale)
        const xSelection = d3.select(xAxisGroup.current)
        xSelection.selectAll('g').remove()
        xSelection.append('g').call(xAxis);

        const yAxis = d3.axisLeft(yScale)
        const ySelection = d3.select(yAxisGroup.current)
        ySelection.selectAll('g').remove()
        ySelection.append('g').call(yAxis);

    }, [xScale, yScale]);

    useEffect(() => {
        console.log(hoverIndex);
    }, [hoverIndex])


    return (
        <svg
            className="scatterplot"
            viewBox={`0, 0, ${width + margin * 2}, ${height + margin * 2}`}
        >
            <g
                transform={`translate(${margin} ${margin})`}
            >
                <Points
                    data={data}
                    xScale={xScale}
                    yScale={yScale}
                    onMouseEnter={(i) => {
                        setHoverIndex(i);
                    }}
                    onMouseLeave={() => {
                        setHoverIndex(null);
                    }}
                />
            </g>
            <g
                ref={xAxisGroup}
                transform={`translate(${margin}, ${height + margin + 20})`}
            />
            <g ref={yAxisGroup}
                transform={`translate(${margin - 20}, ${margin})`}
            />
        </svg >
    );

};

export interface IPointsProps {
    data: IScatterPlotData;
    xScale: d3.ScaleLinear<number, number>;
    yScale: d3.ScaleLinear<number, number>;
    onMouseEnter: (ind: number) => void;
    onMouseLeave: (ind: number) => void;
}

const Points = ({ data, xScale, yScale, onMouseEnter, onMouseLeave }: IPointsProps) => {

    return (
        <g>
            <TransitionGroup
                className="point-group"
                component={null}
                appear={true}
                enter={true}
                exit={true}
            >
                {data.map(({ x, y, id, label }, i) =>
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
                            <foreignObject
                                className="label-container"
                                width="100"
                                height="50"
                                x="13"
                                y="-25"
                            >
                                <div className="label">
                                    <div className="label-text">{label}</div>
                                </div>
                            </foreignObject>
                            <circle
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
