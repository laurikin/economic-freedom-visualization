import React, { useMemo } from 'react'
import * as d3 from 'd3'
import './TrailPlot.css'
import { Trail } from './Trail'

export type Selection = Set<string>

export interface ITrailPlotDatum {
    id: string
    label: string
    data: ({
        x: number
        y: number
    } | null)[]
}

export interface ITrailPlotData {
    [id: string]: ITrailPlotDatum
}

export interface ITrailPlotProps {
    data: ITrailPlotData
    xDomain: [number, number]
    yDomain: [number, number]
    selection: Selection
    pointIndex: number
    colorScale: d3.ScaleOrdinal<string, string>
    marginLeft: number
    marginRight: number
    marginBottom: number
    marginTop: number
    height: number
    width: number
}

export const TrailPlot = ({
    data,
    xDomain,
    yDomain,
    selection,
    pointIndex,
    colorScale,
    marginLeft,
    marginRight,
    marginBottom,
    marginTop,
    width,
    height
}: ITrailPlotProps) => {

    const xScale = useMemo(() => (
        d3.scaleLinear()
            .domain(xDomain)
            .range([0, width])
    ), [xDomain, width])

    const yScale = useMemo(() => (
        d3.scaleLinear()
            .domain(yDomain)
            .range([0, height])
    ), [yDomain, height])

    return (
        <svg
            className={`trailplot`}
            viewBox={`0, 0, ${width + marginLeft + marginRight}, ${height + marginTop + marginBottom}`}
        >
            <g
                transform={`translate(${marginLeft} ${marginTop})`}
            >
                {Array.from(selection).map((id) => {
                    const { data: points } = data[id];
                    const scaledPoints = points.map((point) => {
                        if (point !== null) {
                            const { x, y } = point
                            return [xScale(x), yScale(y)] as [number, number]
                        } else {
                            return null
                        }
                    })
                    const highlightPoint = scaledPoints[pointIndex];
                    return (
                        <g
                            key={id}
                        >
                            <Trail
                                points={scaledPoints}
                                color={colorScale(id)}
                            />

                            {highlightPoint &&

                                <g
                                    className="highlight-point"
                                    transform={`translate(${highlightPoint[0]}, ${highlightPoint[1]})`}
                                >
                                    <circle
                                        stroke="black"
                                        fill={colorScale(id)}
                                        strokeWidth="2"
                                    />
                                </g>
                            }
                        </g>
                    )
                })}
            </g>
        </svg >
    );
}
