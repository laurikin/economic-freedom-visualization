import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
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

    return (
        <svg
            className="scatterplot"
            viewBox={`0, 0, ${width + margin * 2}, ${height + margin * 2}`}
        >
            <g
                transform={`translate(${margin} ${margin})`}
            >
                {
                    data.map(({ x, y, id, label }) =>
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
                            <circle />
                        </g>
                    )
                }
            </g >
            <g>
                <g
                    ref={xAxisGroup}
                    transform={`translate(${margin}, ${height + margin + 20})`}
                />
                <g ref={yAxisGroup}
                    transform={`translate(${margin - 20}, ${margin})`}
                />
            </g>
        </svg >
    );

};
