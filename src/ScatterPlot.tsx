import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

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

    const xScale = d3.scaleLinear()
        .domain(xDomain)
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([0, height]);

    useEffect(() => {
        const xAxis = d3.axisBottom(xScale)
        const xSelection = d3.select(xAxisGroup.current)
        xSelection.selectAll('g').remove()
        xSelection.append('g').call(xAxis);

        const yAxis = d3.axisLeft(yScale)
        const ySelection = d3.select(yAxisGroup.current)
        ySelection.selectAll('g').remove()
        ySelection.append('g').call(yAxis);

    }, [...xDomain, ...yDomain]);

    return (
        <svg
            viewBox={`0, 0, ${width + margin * 2}, ${height + margin * 2}`}
            style={{
                background: '#ccc'
            }}
        >
            <g
                transform={`translate(${margin} ${margin})`}
                style={{
                    background: 'white'
                }}
            >
                {
                    data.map(({ x, y, id }) =>
                        <circle
                            style={{
                                transition: 'all 500ms ease-in-out'
                            }}
                            key={id}
                            transform={`translate(${xScale(x)}, ${yScale(y)})`}
                            r="5"
                        >
                        </circle>
                    )
                }
            </g >
            <g>
                <g
                    ref={xAxisGroup}
                    transform={`translate(${margin}, ${height + margin + 10})`}
                />
                <g ref={yAxisGroup}
                    transform={`translate(${margin - 10}, ${margin})`}
                />
            </g>
        </svg >
    );

};
