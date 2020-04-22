import React, { useMemo, useState, useEffect } from 'react'
import * as d3 from 'd3'
import './TrailPlot.css'
import { Trail } from './Trail'

export type Selection = Set<string>

export interface ITrailPlotDatum {
    id: string
    label: string
    data: {
        x: number
        y: number
    }[]
}

export interface ITrailPlotData {
    [id: string]: ITrailPlotDatum
}

export interface ITrailPlotProps {
    data: ITrailPlotData
    xDomain: [number, number]
    yDomain: [number, number]
    selection: Selection
}

export const TrailPlot = ({ data, xDomain, yDomain, selection }: ITrailPlotProps) => {
    const margin = 60
    const width = 600
    const height = 500

    const [domain, setDomain] = useState(Array.from(selection) as (string)[]);
    const [freeColors, setFreeColors] = useState(new Set() as Set<number>);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(domain);

    useEffect(() => {
        const newDomain = domain.slice(0);
        const newFreeColors = new Set(freeColors);
        let update = false;

        // selection removed add id slot to free colors
        domain.forEach((id, i) => {
            if (!selection.has(id) && !newFreeColors.has(i)) {
                newFreeColors.add(i)
                update = true;
            }
        });

        for (let id of selection.keys()) {
            const index = newDomain.indexOf(id);
            if (index === -1) {
                // selection added
                // get a slot from freeColors or add to domain
                const firstFree = newFreeColors.values().next();
                if (!firstFree.done) {
                    newFreeColors.delete(firstFree.value);
                    newDomain[firstFree.value] = id
                } else {
                    newDomain.push(id)
                }
                update = true;
            } else if (index > -1 && newFreeColors.has(index)) {
                // selection of id that was previously removed
                // and whose slot is still free
                newFreeColors.delete(index)
                update = true;
            }
        }

        if (update) {
            setDomain(newDomain);
            setFreeColors(newFreeColors);
        }
    }, [selection, domain, freeColors])

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

    return (
        <svg
            className={`trailplot`}
            viewBox={`0, 0, ${width + margin * 2}, ${height + margin * 2}`}
        >
            <g
                transform={`translate(${margin} ${margin})`}
            >
                {Array.from(selection).map((id) => {
                    const { data: points } = data[id];
                    const scaledPoints = points.map(({ x, y }) =>
                        [xScale(x), yScale(y)] as [number, number]
                    )
                    return (
                        <g
                            key={id}
                        >
                            <Trail
                                points={scaledPoints}
                                color={colorScale(id)}
                            />
                        </g>
                    )
                })}
            </g>
        </svg>
    );
}

/* {highlightPoint &&
 *     <g
 *         className="highlight-point"
 *         transform={`translate(${xScale(highlightPoint.x)}, ${yScale(highlightPoint.y)})`}
 *     >
 *         <circle
 *             fill="none"
 *             stroke="blue"
 *             strokeWidth="2"
 *             r="8"
 *         />
 *     </g>
 * } */
