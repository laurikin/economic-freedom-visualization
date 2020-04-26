import React, { useEffect, useRef, useMemo } from 'react'
import * as d3 from 'd3'
import { Points, IPointsData, ISelectedIds } from './Points'
import './ScatterPlot.css'

export type IScatterPlotData = IPointsData

export type IScatterPlotSelection = ISelectedIds

export interface IScatterPlotProps {
    data: IPointsData
    xDomain: [number, number]
    yDomain: [number, number]
    selection: IScatterPlotSelection
    marginLeft: number
    marginRight: number
    marginBottom: number
    marginTop: number
    width: number
    height: number
}


export const ScatterPlot = ({
    data,
    xDomain,
    yDomain,
    selection,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    width,
    height
}: IScatterPlotProps) => {

    const xAxisGroup = useRef(null)
    const yAxisGroup = useRef(null)
    const xGridGroup = useRef(null)
    const yGridGroup = useRef(null)

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

    // use d3 to render the axes after mounting the component
    useEffect(() => {
        const xSelection = d3.select(xAxisGroup.current)
        const ySelection = d3.select(yAxisGroup.current)
        const xGridSelection = d3.select(xGridGroup.current)
        const yGridSelection = d3.select(yGridGroup.current)
        xSelection.selectAll('g').remove()
        ySelection.selectAll('g').remove()
        xGridSelection.selectAll('g').remove()
        yGridSelection.selectAll('g').remove()

        const xAxis = d3.axisBottom(xScale)
        xSelection.append('g').call(xAxis)

        const yAxis = d3.axisLeft(yScale)
        ySelection.append('g').call(yAxis)

        const xGridLines = d3.axisTop(xScale)
            .tickFormat(() => '')
            .tickSize(height)
        xGridSelection.append('g').call(xGridLines)

        const yGridLines = d3.axisLeft(yScale)
            .tickFormat(() => '')
            .tickSize(-width)
        yGridSelection.append('g').call(yGridLines)


    }, [xScale, yScale, height, width])

    return (
        <svg
            className={`scatterplot ${selection.size > 0 ? 'selection' : ''}`}
            viewBox={`0, 0, ${width + marginLeft + marginRight}, ${height + marginTop + marginBottom}`}
        >
            <g
                transform={`translate(${marginLeft} ${marginTop})`}
            >
                <clipPath
                    id="scatter-plot-clip-path"
                >
                    <rect
                        x="0"
                        y="0"
                        width={width}
                        height={height}
                        stroke="red"
                        strokeWidth="2"
                        opacity="0.2"
                    />
                </clipPath>

                <g
                    clipPath="url(#scatter-plot-clip-path)"
                >
                    <Points
                        data={data}
                        xScale={xScale}
                        yScale={yScale}
                        selected={selection}
                    />
                </g>
            </g>
            <g
                className="grid-lines"
                ref={xGridGroup}
                transform={`translate(${marginLeft}, ${height + marginTop})`}
            >
            </g>
            <g
                className="grid-lines"
                ref={yGridGroup}
                transform={`translate(${marginLeft}, ${marginTop})`}
            >
            </g>
            <g
                ref={xAxisGroup}
                transform={`translate(${marginLeft}, ${height + marginTop + 10})`}
            >
                <text
                    className="axis-label"
                    transform={`translate(${width / 2},40)`}
                >Economic Freedom Score</text>
            </g>
            <g ref={yAxisGroup}
                transform={`translate(${marginLeft - 10}, ${marginTop})`}
            >
                <text
                    className="axis-label"
                    y={-50}
                    x={- height / 2}
                    transform={`rotate(-90)`}
                >GDP per capita (2010 US$)</text>
            </g>
        </svg >
    )

}

