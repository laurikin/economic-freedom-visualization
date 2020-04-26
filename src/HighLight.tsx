import React, { useMemo } from 'react'
import { IRecord } from './loadData'
import * as d3 from 'd3'

import './Highlight.css'

export interface IHighLightProps {
    width: number,
    height: number,
    marginLeft: number,
    marginRight: number,
    marginBottom: number,
    marginTop: number,
    xDomain: [number, number],
    yDomain: [number, number],
    item: IRecord,
    onClick: () => void
}

export const Highlight = ({
    xDomain,
    yDomain,
    width,
    height,
    item,
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
    onClick
}: IHighLightProps) => {

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
            className="highlight"
            viewBox={`0, 0, ${width + marginLeft + marginRight}, ${height + marginTop + marginBottom}`}
        >
            <g
                transform={`translate(${marginLeft} ${marginTop})`}
            >
                <circle
                    transform={`translate(${xScale(item.x)}, ${yScale(item.y)})`}
                    onClick={(e) => {
                        e.stopPropagation()
                        onClick()
                    }}
                />

                <foreignObject
                    x={0}
                    y={0}
                    width="250"
                    height="100"
                >
                    <div
                        className="label"
                    >
                        <div
                            className="label-title"
                        >
                            {item.label}
                        </div>
                        <div>
                            GDP per capita: {item.y.toFixed(0)}
                        </div>
                        <div>
                            Economic Freedom Score: {item.x.toFixed(2)}
                        </div>
                    </div>
                </foreignObject>
            </g>
        </svg>
    )
}
