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

const transitionTime = 1000 / 10

export const TrailSegment = ({ startPoint, endPoint, color, strokeWidth, opacity, index }: ITrailSegmentProps) => {

    const transitionDelay = (index - 1) / 10 * 1000

    const [state, setState] = useState('init' as 'init' | 'animate' | 'done')

    setImmediate(() => {
        // trigger the line animation on once component is mounted
        setState('animate')
    })

    useEffect(() => {
        const timeout = setTimeout(() => {
            // disable transitions when component is done
            setState('done')
        }, transitionDelay + transitionTime)

        return () => clearTimeout(timeout)
    }, [transitionDelay, transitionTime])

    return (
        <path
            style={{
                transition: state === 'done' ? 'none' : `all ${transitionTime}ms linear`,
                transitionDelay: `${transitionDelay}ms`,
                opacity
            }}
            fill="none"
            stroke={color}
            strokeWidth={state === 'animate' ? strokeWidth : 0}
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
