import React, { useMemo } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import * as d3 from 'd3'
import './Points.css';

export type IPointsDatum = {
    id: string
    label: string | undefined;
    x: number
    y: number
    region: string
}

export type IPointsData = IPointsDatum[]

export interface IPointsProps {
    data: IPointsData
    selected: ISelectedIds
    xScale: d3.ScaleLinear<number, number>
    yScale: d3.ScaleLinear<number, number>
    regions: string[]
}

export type ISelectedIds = Set<string>

export const Points = ({ data, xScale, yScale, selected, regions }: IPointsProps) => {

    const colorScale = useMemo(() => (
        d3.scaleOrdinal(d3.schemeCategory10).domain(regions)
    ), [regions])

    return (
        <g
            className="point-group"
        >
            <TransitionGroup
                component={null}
                appear={true}
                enter={true}
                exit={true}
            >
                {data.map((item) => {
                    const { x, y, id, region } = item;
                    if (selected.has(id)) {
                        return null
                    } else {
                        const color = selected.size === 0 ? colorScale(region) : '#ddd'
                        return (
                            <CSSTransition
                                key={id}
                                timeout={300}
                                classNames="point"
                            >
                                <g
                                    style={{
                                        transform: `translate(${xScale(x)}px, ${yScale(y)}px)`
                                    }}
                                    key={id}
                                    className="point"
                                >
                                    <circle
                                        style={{
                                            fill: color,
                                            transition: 'fill 300ms'
                                        }}
                                    />
                                </g>
                            </CSSTransition>
                        );
                    }
                })}
            </TransitionGroup>
        </g >
    );
}
