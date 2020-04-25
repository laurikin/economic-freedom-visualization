import React, { useState, useEffect, useMemo } from 'react'
import * as d3 from 'd3'
import { ScatterPlot, IScatterPlotSelection } from './ScatterPlot'
import { TrailPlot } from './TrailPlot'
import { Legend } from './Legend'
import { IData } from './loadData'
import Select from 'react-select'

import './App.css'

const App = ({ data: inputData }: { data: IData }) => {

    const { xDomain, yDomain, trailplotData } = inputData
    const datas = inputData.data
    const years = inputData.years
    const countries = inputData.countries
    const margin = 60
    const width = 600
    const height = 500

    const [dataInd, setDataInd] = useState(0)
    const [selection, setSelection] = useState(new Set() as IScatterPlotSelection)
    const [domain, setDomain] = useState(Array.from(selection) as (string)[]);
    const [freeColors, setFreeColors] = useState(new Set() as Set<number>);


    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(domain);
    const data = datas[dataInd % years.length]

    const options = useMemo(() => (
        countries
            .filter(c => !selection.has(c))
            .map(c => ({ value: c, label: c }))
    ), [countries, selection]);

    const legendItems = useMemo(() => (
        countries
            .filter(c => selection.has(c))
            .map(c => ({ id: c, label: c }))
    ), [countries, selection])

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

    return (
        <div
            id="main-container"
        >
            <svg
                id="chart-container"
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

            <div
                id="side-bar"
            >
                <div
                    id="range-selector"
                >
                    <div>{years[dataInd]}</div>

                    <input
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

                </div>

                <Select
                    options={options}
                    hideSelectedOptions={true}
                    blurInputOnSelect={false}
                    value={null}
                    placeholder="Select country"
                    isMulti={false}
                    onChange={(choice: unknown, action) => {
                        if (action.action === 'select-option') {
                            const myChoice = choice as { value: string, choice: string };
                            if (choice) {
                                const newSelection = new Set(selection)
                                newSelection.add(myChoice.value)
                                setSelection(newSelection)
                            }
                        }
                    }}
                />
                <Legend
                    items={legendItems}
                    colorScale={colorScale}
                    onItemRemove={(id) => {
                        const newSelection = new Set(selection)
                        newSelection.delete(id)
                        setSelection(newSelection)
                    }}
                />
            </div>

        </div>
    )
}

export default App
