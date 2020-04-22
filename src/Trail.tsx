import React, { useState } from 'react'
import * as d3 from 'd3'

export interface ITrailProps {
    points: [number, number][],
    color: string
}

export const Trail = ({ points, color }: ITrailProps) => {


    const [go, setGo] = useState(false as boolean)

    setImmediate(() => {
        // trigger the line animation on once component is mounted
        setGo(true)
    })


    return (
        <>
            {points.map((point, i) => {
                if (i < 1) {
                    return null;
                } else {
                    const lastPoint = points[i - 1]
                    return (
                        <g
                            key={i}
                        >
                            <path
                                style={{
                                    transition: `all ${1 / 10}s linear`,
                                    transitionDelay: `${(i - 1) / 10}s`
                                }}
                                fill="none"
                                stroke={color}
                                strokeWidth={(i + 1) / 2}
                                d={go ?
                                    d3.line()([
                                        lastPoint,
                                        point
                                    ]) ?? '' :
                                    d3.line()([
                                        lastPoint,
                                        lastPoint
                                    ]) ?? ''
                                }
                            />
                        </g>
                    )
                }
            })}
        </>
    )
}
