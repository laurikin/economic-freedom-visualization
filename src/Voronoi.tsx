import React, { useMemo } from 'react'
import { IRecord } from './loadData'
import * as d3 from 'd3'
import './Voronoi.css'

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
    onHover: (item: IRecord | null) => void
    onClick: (item: IRecord) => void
    hoverItem: IRecord | null
}

export const Voronoi = ({
    xDomain,
    yDomain,
    width,
    height,
    data,
    dataIndex,
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
    onHover,
    onClick,
    hoverItem
}: IVoronoiProps) => {

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
                [-10, -10],
                [width + 10, height + 10]]
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
                    const record = data[dataIndex][i]
                    const clipPathId = `clip-path-${i}`
                    return (
                        <g
                            key={record.id}
                            onMouseOver={() => {
                                onHover(data[dataIndex][i])
                            }}
                            onMouseLeave={() => {
                                onHover(null)
                            }}
                        >
                            <defs>
                                <clipPath
                                    id={clipPathId}
                                >
                                    <circle
                                        r="30"
                                        cx={xScale(record.x)}
                                        cy={yScale(record.y)}
                                    />
                                </clipPath>
                            </defs>
                            <polygon
                                clipPath={`url(#${clipPathId})`}
                                fill="blue"
                                stroke="black"
                                opacity="0"
                                points={p.join()}
                                strokeWidth="1"
                            />
                            {hoverItem?.id === record.id &&
                                <g
                                    className="highlight"
                                    transform={`translate(${xScale(hoverItem.x)}, ${yScale(hoverItem.y)})`}
                                >
                                    <circle
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onClick(record)
                                        }}
                                    />
                                </g>
                            }
                        </g>
                    )
                })}
            </g>
        </svg >
    )
}

