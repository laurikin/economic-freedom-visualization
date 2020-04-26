import React from 'react'
import { IRecord } from './loadData'

import './Highlight.css'

export interface IDetailProps {
    width: number,
    height: number,
    marginLeft: number,
    marginRight: number,
    marginBottom: number,
    marginTop: number,
    item: IRecord,
}

export const Detail = ({
    width,
    height,
    item,
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
}: IDetailProps) => {

    return (
        <svg
            className="highlight"
            viewBox={`0, 0, ${width + marginLeft + marginRight}, ${height + marginTop + marginBottom}`}
        >
            <g
                transform={`translate(${marginLeft} ${marginTop})`}
            >
                <foreignObject
                    x={0}
                    y={0}
                    width="250"
                    height="100"
                >
                    <div
                        className="label"
                    >
                        <div
                            className="label-title"
                        >
                            {item.label}
                        </div>
                        <div>
                            GDP per capita: {item.y.toFixed(0)}
                        </div>
                        <div>
                            Economic Freedom Score: {item.x.toFixed(2)}
                        </div>
                    </div>
                </foreignObject>
            </g>
        </svg>
    )
}
