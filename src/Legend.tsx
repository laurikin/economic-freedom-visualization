import React from 'react'
import './Legend.css'

export interface ILegendProps {
    items: {
        id: string
        label: string
    }[]
    colorScale: d3.ScaleOrdinal<string, string>
    onItemRemove?: (id: string, label: string) => void
}

export const Legend = ({ items, colorScale, onItemRemove }: ILegendProps) => {

    return (
        <div className="legend">
            {items.map(({ label, id }) => {
                return (
                    <div
                        key={id}
                        className="item"
                    >
                        <div
                            className="color-patch"
                            style={{
                                backgroundColor: colorScale(id),
                            }}
                        ></div>
                        <div className="label">{label}</div>
                        {onItemRemove &&
                            <div
                                className="x-button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    onItemRemove(id, label)
                                }}
                            >x</div>
                        }
                    </div>
                );
            })}
        </div>
    )
}
