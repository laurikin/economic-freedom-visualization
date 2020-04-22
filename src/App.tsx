import React, { useState, useEffect } from 'react'
import { ScatterPlot, IScatterPlotSelection } from './ScatterPlot'
import { datas, years } from './data'
import { TrailPlot, ITrailPlotData } from './TrailPlot'
import * as d3 from 'd3'
import './App.css'

const App = () => {

    const [dataInd, setDataInd] = useState(0)
    const [selection, setSelection] = useState(new Set() as IScatterPlotSelection)
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

    const margin = 60
    const width = 600
    const height = 500

    const data = datas[dataInd % years.length]
    const xDomain: [number, number] = [0, 10]
    const yDomain: [number, number] = [10, 0]

    interface IRow {
        id: string
        label: string
        x: number
        y: number
        year: number
    }

    const rowData = datas.reduce((acc: IRow[], data, i) => {
        const rows: IRow[] = data.map(d => ({
            ...d,
            year: years[i]
        }))
        return acc.concat(rows)
    }, [])

    const trailplotData: ITrailPlotData = rowData.reduce((acc: ITrailPlotData, row) => {
        acc[row.id] = acc[row.id] || {
            id: row.id,
            label: row.label,
            data: []
        }
        acc[row.id].data.push({
            x: row.x,
            y: row.y
        })

        const a = acc
        return a
    }, {})

    return (
        <React.Fragment>
            <div
                style={{
                    padding: 40,
                    maxWidth: 800
                }}
            >
                <svg
                    viewBox={`0, 0, ${width + margin * 2}, ${height + margin * 2}`}
                >

                    <ScatterPlot
                        xDomain={xDomain}
                        yDomain={yDomain}
                        selection={selection}
                        data={data}
                        onSelect={(selection) => {
                            setSelection(selection);
                        }}
                    />

                    <TrailPlot
                        xDomain={xDomain}
                        yDomain={yDomain}
                        data={trailplotData}
                        selection={selection}
                        pointIndex={dataInd}
                        colorScale={colorScale}
                        onSelect={(selection) => {
                            setSelection(selection);
                        }}
                    />

                </svg>

                <input
                    style={{
                        width: '100%'
                    }}
                    type="range"
                    value={dataInd}
                    onChange={(e) => {
                        e.preventDefault()
                        e.stopPropagation()

                        setDataInd(parseInt(e.currentTarget.value, 10))
                    }}
                    min="0"
                    max={years.length - 1}
                />

                <div>{years[dataInd]}</div>
            </div>

        </React.Fragment>
    )
}

export default App
