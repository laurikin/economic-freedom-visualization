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
        const xAxis = d3.axisBottom(xScale)
        const xSelection = d3.select(xAxisGroup.current)
        xSelection.selectAll('g').remove()
        xSelection.append('g').call(xAxis)

        const yAxis = d3.axisLeft(yScale)
        const ySelection = d3.select(yAxisGroup.current)
        ySelection.selectAll('g').remove()
        ySelection.append('g').call(yAxis)

    }, [xScale, yScale])

    return (
        <svg
            className={`scatterplot ${selection.size > 0 ? 'selection' : ''}`}
            viewBox={`0, 0, ${width + marginLeft + marginRight}, ${height + marginTop + marginBottom}`}
        >
            <g
                transform={`translate(${marginLeft} ${marginTop})`}
            >
                <Points
                    data={data}
                    xScale={xScale}
                    yScale={yScale}
                    selected={selection}
                />
            </g>
            <g
                ref={xAxisGroup}
                transform={`translate(${marginLeft}, ${height + marginTop + 10})`}
            >
                <text
                    className="axis-label"
                    transform={`translate(${width / 2},40)`}
                >Economic Freedom</text>
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

