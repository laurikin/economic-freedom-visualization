import React from 'react'
import { TrailSegment } from './TrailSegment'

export interface ITrailProps {
    points: ([number, number] | null)[],
    color: string
}

export const Trail = ({ points, color }: ITrailProps) => {


    return (
        <>
            {points.map((point, i) => {
                const lastPoint = points[i - 1]
                if (i < 1) {
                    return null
                } else if (point === null || lastPoint === null) {
                    return null
                } else {
                    return (
                        <g
                            key={i}
                        >
                            <TrailSegment
                                color={color}
                                strokeWidth={(i + 1) / 4}
                                opacity={Math.max(i / points.length, 0.4)}
                                startPoint={lastPoint}
                                endPoint={point}
                                index={i}
                            />
                        </g>
                    )
                }
            })}
        </>
    )
}
