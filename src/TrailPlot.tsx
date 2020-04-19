import React, { useMemo, useState } from 'react'
import * as d3 from 'd3'
import './TrailPlot.css'

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
    pointIndex: number
    xDomain: [number, number]
    yDomain: [number, number]
}

export const TrailPlot = ({ data, xDomain, yDomain, pointIndex }: ITrailPlotProps) => {
    const margin = 60
    const width = 600
    const height = 500

    const [go, setGo] = useState(false as boolean)

    setImmediate(() => {
        setGo(true)
    })

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
                    const highlightPoint = points[pointIndex]
                    return (
                        <g
                            key={id}
                        >
                            {highlightPoint &&
                                <g
                                    className="highlight-point"
                                    transform={`translate(${xScale(highlightPoint.x)}, ${yScale(highlightPoint.y)})`}
                                >
                                    <circle
                                        fill="none"
                                        stroke="blue"
                                        strokeWidth="2"
                                        r="8"
                                    />
                                </g>
                            }
                            {points.map((point, i) => {
                                if (i < 1) {
                                    return null;
                                } else {
                                    const lastPoint = points[i - 1]
                                    const point1: [number, number] = [xScale(lastPoint.x), yScale(lastPoint.y)]
                                    const point2: [number, number] = [xScale(point.x), yScale(point.y)]
                                    return (
                                        <g
                                            key={`${id}|${i}`}
                                        >
                                            <path
                                                style={{
                                                    transition: 'all 0.5s linear',
                                                    transitionDelay: `${(i - 1) / 2}s`
                                                }}
                                                fill="none"
                                                stroke="black"
                                                strokeWidth={(i + 1) / 2}
                                                d={go ?
                                                    d3.line()([
                                                        point1,
                                                        point2
                                                    ]) ?? '' :
                                                    d3.line()([
                                                        point1,
                                                        point1
                                                    ]) ?? ''
                                                }
                                            />
                                        </g>
                                    )
                                }
                            })}
                        </g>
                    )
                })}
            </g>
        </svg>
    );
}
