import React, { useMemo } from 'react'
import { IRecord } from './loadData'
import * as d3 from 'd3'

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
            <circle
                transform={`translate(${xScale(item.x)}, ${yScale(item.y)})`}
                onClick={(e) => {
                    e.stopPropagation()
                    onClick()
                }}
            />
        </svg >
    )
}
