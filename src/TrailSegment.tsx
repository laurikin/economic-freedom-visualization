import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'

export interface ITrailSegmentProps {
    startPoint: [number, number]
    endPoint: [number, number]
    strokeWidth: number
    color: string
    opacity: number
    index: number
}

const transitionTime = 1000 / 20

export const TrailSegment = ({ startPoint, endPoint, color, strokeWidth, opacity, index }: ITrailSegmentProps) => {

    const transitionDelay = (index - 1) * transitionTime

    const [state, setState] = useState('init' as 'init' | 'animate' | 'done')

    useEffect(() => {
        setImmediate(() => {
            // trigger the line animation on once component is mounted
            setState('animate')
        })
    }, [])

    useEffect(() => {
        const timeout = setTimeout(() => {
            // disable transitions when component is done
            setState('done')
        }, transitionDelay + transitionTime)

        return () => clearTimeout(timeout)
    }, [transitionDelay])

    return (
        <path
            style={{
                transitionProperty: state === 'done' ? 'none' : 'all',
                transitionDuration: `${transitionTime}ms`,
                transitionTimingFunction: 'linear',
                transitionDelay: `${transitionDelay}ms`,
                opacity
            }}
            fill="none"
            stroke={color}
            strokeWidth={state === 'init' ? 0 : strokeWidth}
            strokeLinecap="round"
            d={state !== 'init' ?
                d3.line()([
                    startPoint,
                    endPoint
                ]) ?? '' :
                d3.line()([
                    startPoint,
                    startPoint
                ]) ?? ''
            }
        />
    )
}
