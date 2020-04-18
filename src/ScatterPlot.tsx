import React from 'react';
import * as d3 from 'd3';

export type IScatterPlotData = {
    id: string,
    x: number,
    y: number
}[]

export interface IScatterPlotProps {
    data: IScatterPlotData
}

export const ScatterPlot = ({ data }: IScatterPlotProps) => {

    const margin = 20;
    const width = 600;
    const height = 500

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.x) ?? 0])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.y) ?? 0])
        .range([0, height]);

    return (
        <svg
            viewBox={`0, 0, ${width + margin * 2}, ${height + margin * 2}`}
            style={{
                background: '#ccc'
            }}
        >
            <g
                transform={`matrix(1 0 0 -1 ${margin} ${height + margin})`}
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
        </svg >
    );

};
