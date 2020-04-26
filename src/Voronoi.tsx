import React, { useMemo } from 'react'
import { IRecord } from './loadData'
import * as d3 from 'd3'

export interface IVoronoiProps {
    width: number,
    height: number,
    marginLeft: number,
    marginRight: number,
    marginBottom: number,
    marginTop: number,
    xDomain: [number, number],
    yDomain: [number, number],
    data: IRecord[][],
    dataIndex: number
    onSelect: (item: IRecord | null) => void
}

export const Voronoi = ({ xDomain, yDomain, width, height, data, dataIndex, marginTop, marginLeft, marginRight, marginBottom, onSelect }: IVoronoiProps) => {

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

    const voronoi = useMemo(() => (
        d3.voronoi()
            .extent([
                [0, 0],
                [width, height]]
            )
    ), [width, height])

    const polyLists = useMemo(() => (
        data.map((records) =>
            voronoi(records.map(d => [xScale(d.x), yScale(d.y)]))
                .polygons()
        )
    ), [data, xScale, yScale, voronoi])

    return (
        <svg
            viewBox={`0, 0, ${width + marginLeft + marginRight}, ${height + marginTop + marginBottom}`}
        >
            <g
                transform={`translate(${marginLeft} ${marginTop})`}
            >
                {polyLists[dataIndex].map((p, i) => {
                    return (
                        <polygon
                            fill="white"
                            opacity="0"
                            points={p.join()}
                            stroke="black"
                            strokeWidth="1"
                            onMouseEnter={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onSelect(data[dataIndex][i])
                            }}
                        />
                    )
                })}
            </g>
        </svg >
    )
}
