import React, { useEffect, useRef, useMemo, useState } from 'react'
import * as d3 from 'd3'
import { CSSTransition } from 'react-transition-group'
import { Points, IPointsData, IPointsDatum, ISelectedIds } from './Points'
import './ScatterPlot.css'

export type IScatterPlotData = IPointsData

export type IScatterPlotSelection = ISelectedIds

export interface IScatterPlotProps {
    data: IPointsData
    xDomain: [number, number]
    yDomain: [number, number]
    selection: IScatterPlotSelection
    onSelect: (selection: IScatterPlotSelection) => void
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
    onSelect,
    selection,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    width,
    height
}: IScatterPlotProps) => {

    const [showLabel, setShowLabel] = useState(false)
    const [hoverItem, setHoverItem] = useState(null as (IPointsDatum | null))

    const xAxisGroup = useRef(null)
    const yAxisGroup = useRef(null)

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

    // make sure label is hidden when new data is rendered
    useEffect(() => {
        setShowLabel(false)
        setHoverItem(null)
    }, [data])

    const labelLeft = hoverItem ? xScale(hoverItem.x) > width - 130 : false

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
                    onMouseEnter={(item) => {
                        setShowLabel(true)
                        setHoverItem(item)
                    }}
                    onMouseLeave={() => { }}
                />
                <g
                >
                    <CSSTransition
                        in={showLabel}
                        className="highlight"
                        unmountOnExit
                        timeout={300}
                    >
                        <g
                            className="highlight"
                            transform={`translate(${xScale(hoverItem?.x ?? 0)}, ${yScale(hoverItem?.y ?? 0)})`}
                        >
                            <circle
                                className={`
                                    ${hoverItem !== null && selection.has(hoverItem.id) ? 'selected' : ''}
                                    ${selection.size > 0 ? 'selection-mode' : ''}
                                `}
                                onClick={() => {
                                    if (hoverItem !== null) {
                                        const newSelection: Set<string> = new Set(selection)
                                        if (selection.has(hoverItem.id)) {
                                            newSelection.delete(hoverItem.id)
                                            onSelect(newSelection);
                                        } else {
                                            newSelection.add(hoverItem.id);
                                            onSelect(newSelection);
                                        }


                                    }
                                }}
                                onMouseEnter={() => {
                                    setShowLabel(true)
                                }}
                                onMouseLeave={() => {
                                    setShowLabel(false)
                                }}
                            />
                        </g>
                    </CSSTransition>
                    <CSSTransition
                        in={showLabel}
                        className="label-container"
                        unmountOnExit
                        timeout={300}
                    >
                        <g
                            className="label-container"
                            transform={`translate(${xScale(hoverItem?.x ?? 0)}, ${yScale(hoverItem?.y ?? 0)})`}
                        >
                            <foreignObject
                                width="100"
                                height="50"
                                x={labelLeft ? -115 : 15}
                                y="-25"
                            >
                                <div
                                    className="label"
                                    style={{
                                        justifyContent: labelLeft ? 'right' : 'left'
                                    }}
                                >
                                    <div className="label-text">{hoverItem?.label ?? ''}</div>
                                </div>
                            </foreignObject>
                        </g>
                    </CSSTransition>
                </g>
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
                >GDP / Capita</text>
            </g>
        </svg >
    )

}

