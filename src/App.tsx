import React, { useState, useEffect, useMemo } from 'react'
import * as d3 from 'd3'
import { ScatterPlot, IScatterPlotSelection } from './ScatterPlot'
import { TrailPlot } from './TrailPlot'
import { Legend } from './Legend'
import { IData, IRecord } from './loadData'
import Select from 'react-select'
import { Voronoi } from './Voronoi'
import { Detail } from './Detail'

import './App.css'

const App = ({ data: inputData }: { data: IData }) => {
    const marginTop = 20
    const marginBottom = 80
    const marginLeft = 80
    const marginRight = 20
    const width = 600
    const height = 500

    const { xDomain: initialXDomain, yDomain: initialYDomain, trailplotData } = inputData
    const datas = inputData.data
    const years = inputData.years
    const countries = inputData.countries
    const regions = inputData.regions
    const [dataInd, setDataInd] = useState(0)
    const [selection, setSelection] = useState(new Set() as IScatterPlotSelection)
    const [domain, setDomain] = useState(Array.from(selection) as (string)[])
    const [freeColors, setFreeColors] = useState(new Set() as Set<number>)
    const [hoverItem, setHoverItem] = useState(null as IRecord | null)

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(domain)
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

    const regionLegendItems = useMemo(() => (
        regions
            .map(r => ({ id: r, label: r }))
    ), [regions])

    const [zoomToSelection, setZoomToSelection] = useState(false)

    const [xDomain, yDomain] = useMemo(() => {
        if (!zoomToSelection || selection.size === 0) {
            return [initialXDomain, initialYDomain]
        } else {
            const values = Array.from(selection).reduce((acc: { x: number, y: number }[], id) => {
                trailplotData[id].data.forEach((point) => {
                    if (point !== null) {
                        acc.push(point)
                    }
                })
                return acc
            }, [])
            const xDomain = initialXDomain
            const yDomain: [number, number] = [d3.max(values, v => v.y) ?? initialYDomain[1], 0]
            return [xDomain, yDomain]
        }
    }, [trailplotData, selection, initialXDomain, initialYDomain, zoomToSelection])

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
            <div
                id="chart-container"
            >
                <svg
                    viewBox={`0, 0, ${width + marginLeft + marginRight}, ${height + marginTop + marginBottom}`}
                    onMouseLeave={() => {
                        setHoverItem(null)
                    }}
                >

                    <ScatterPlot
                        xDomain={xDomain}
                        yDomain={yDomain}
                        marginLeft={marginLeft}
                        marginRight={marginRight}
                        marginTop={marginTop}
                        marginBottom={marginBottom}
                        width={width}
                        height={height}
                        selection={selection}
                        data={data}
                        regions={regions}
                    />

                    <TrailPlot
                        xDomain={xDomain}
                        yDomain={yDomain}
                        marginLeft={marginLeft}
                        marginRight={marginRight}
                        marginTop={marginTop}
                        marginBottom={marginBottom}
                        width={width}
                        height={height}
                        data={trailplotData}
                        selection={selection}
                        pointIndex={dataInd}
                        colorScale={colorScale}
                    />

                    {hoverItem &&
                        <Detail
                            marginLeft={marginLeft}
                            marginRight={marginRight}
                            marginTop={marginTop}
                            marginBottom={marginBottom}
                            width={width}
                            height={height}
                            item={hoverItem}
                        />
                    }

                    <Voronoi
                        xDomain={xDomain}
                        yDomain={yDomain}
                        marginLeft={marginLeft}
                        marginRight={marginRight}
                        marginTop={marginTop}
                        marginBottom={marginBottom}
                        width={width}
                        height={height}
                        data={datas}
                        dataIndex={dataInd}
                        hoverItem={hoverItem}
                        onHover={(item) => {
                            setHoverItem(item)
                        }}
                        onClick={(item) => {
                            const { id } = item
                            const newSelection = new Set(selection)
                            if (selection.has(id)) {
                                newSelection.delete(id)
                                setSelection(newSelection)
                            } else {
                                newSelection.add(id)
                                setSelection(newSelection)
                            }
                        }}
                    />

                    }
                </svg>
            </div>

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

                <div
                    className="options"
                >
                    <div
                        className="option"
                    >
                        <input
                            name="zoom"
                            type="checkbox"
                            checked={zoomToSelection}
                            onChange={(e) => {
                                setZoomToSelection(e.target.checked)
                            }}
                        />
                        <label htmlFor="zoom">Zoom to Selection</label>
                    </div>
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
                {selection.size === 0 &&
                    <Legend
                        items={regionLegendItems}
                        colorScale={colorScale}
                    />
                }
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
