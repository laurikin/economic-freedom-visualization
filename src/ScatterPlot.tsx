import React, { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { CSSTransition } from 'react-transition-group';
import { Points, IPointsData } from './Points';
import './ScatterPlot.css';

export type IScatterPlotData = IPointsData;

export interface IScatterPlotProps {
    data: IPointsData;
    xDomain: [number, number];
    yDomain: [number, number];
}

export const ScatterPlot = ({ data, xDomain, yDomain }: IScatterPlotProps) => {

    const initialHoverIndex = null;
    const [showLabel, setShowLabel] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(initialHoverIndex as (number | null))

    const xAxisGroup = useRef(null);
    const yAxisGroup = useRef(null);

    const margin = 60;
    const width = 600;
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

    useEffect(() => {
        const xAxis = d3.axisBottom(xScale)
        const xSelection = d3.select(xAxisGroup.current)
        xSelection.selectAll('g').remove()
        xSelection.append('g').call(xAxis);

        const yAxis = d3.axisLeft(yScale)
        const ySelection = d3.select(yAxisGroup.current)
        ySelection.selectAll('g').remove()
        ySelection.append('g').call(yAxis);

    }, [xScale, yScale]);

    useEffect(() => {
        setHoverIndex(null);
    }, [data]);

    const hoverItem = data[hoverIndex ?? -1];
    const labelLeft = hoverItem ? xScale(hoverItem.x) > width - 130 : false;

    return (
        <svg
            className="scatterplot"
            viewBox={`0, 0, ${width + margin * 2}, ${height + margin * 2}`}
        >
            <g
                transform={`translate(${margin} ${margin})`}
            >
                <Points
                    data={data}
                    xScale={xScale}
                    yScale={yScale}
                    onMouseEnter={(i) => {
                        setShowLabel(true);
                        setHoverIndex(i);
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
                                onMouseEnter={() => {
                                    setShowLabel(true);
                                }}
                                onMouseLeave={() => {
                                    setShowLabel(false);
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
                transform={`translate(${margin}, ${height + margin + 20})`}
            />
            <g ref={yAxisGroup}
                transform={`translate(${margin - 20}, ${margin})`}
            />
        </svg >
    );

};

