import React, { useMemo } from 'react'
import * as d3 from 'd3'
import './TrailPlot.css'
import { Trail } from './Trail'

export type Selection = Map<string, true>

export interface ITrailPlotDatum {
    id: string
    label: string
    data: {
        x: number
        y: number
    }[]
}

export interface ITrailPlotData {
    [id: string]: ITrailPlotDatum
}

export interface ITrailPlotProps {
    data: ITrailPlotData
    xDomain: [number, number]
    yDomain: [number, number]
    selection: Selection
}

export const TrailPlot = ({ data, xDomain, yDomain, selection }: ITrailPlotProps) => {
    const margin = 60
    const width = 600
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

    return (
        <svg
            className={`trailplot`}
            viewBox={`0, 0, ${width + margin * 2}, ${height + margin * 2}`}
        >
            <g
                transform={`translate(${margin} ${margin})`}
            >
                {Object.keys(data).map((key) => {
                    const { id, data: points } = data[key];
                    if (!selection.has(id)) {
                        return null;
                    } else {
                        const scaledPoints = points.map(({ x, y }) =>
                            [xScale(x), yScale(y)] as [number, number]
                        )
                        return (
                            <g
                                key={id}
                            >
                                <Trail
                                    points={scaledPoints}
                                />
                            </g>
                        )
                    }
                })}
            </g>
        </svg>
    );
}

/* {highlightPoint &&
 *     <g
 *         className="highlight-point"
 *         transform={`translate(${xScale(highlightPoint.x)}, ${yScale(highlightPoint.y)})`}
 *     >
 *         <circle
 *             fill="none"
 *             stroke="blue"
 *             strokeWidth="2"
 *             r="8"
 *         />
 *     </g>
 * } */
