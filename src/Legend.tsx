import React from 'react'
import './Legend.css'

export interface ILegendProps {
    items: {
        id: string;
        label: string;
    }[]
    colorScale: d3.ScaleOrdinal<string, string>
}

export const Legend = ({ items, colorScale }: ILegendProps) => {

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
                    </div>
                );
            })}
        </div>
    )
}
