import React, { useState } from 'react'
import { ScatterPlot, IScatterPlotSelection } from './ScatterPlot'
import { datas, years } from './data'
import { TrailPlot, ITrailPlotData } from './TrailPlot'
import './App.css'

const App = () => {

    const [dataInd, setDataInd] = useState(0)
    const [selection, setSelection] = useState(new Set() as IScatterPlotSelection)

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
