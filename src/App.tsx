import React, { useState } from 'react';
import * as d3 from 'd3';
import { ScatterPlot, IScatterPlotData } from './ScatterPlot';

const App = () => {

    const datas: IScatterPlotData[] = [
        [
            {
                id: '1',
                label: 'Finland',
                x: 0,
                y: 0
            },
            {
                id: '2',
                label: 'Sweden',
                x: 3,
                y: 2
            },
            {
                id: '3',
                label: 'Norway',
                x: 4,
                y: 6
            },
            {
                id: '4',
                label: 'Denmark',
                x: 10,
                y: 10
            }
        ],

        [
            {
                id: '1',
                label: 'Finland',
                x: 1,
                y: 0
            },
            {
                id: '2',
                label: 'Sweden',
                x: 4,
                y: 2
            },
            {
                label: 'Norway',
                id: '3',
                x: 3,
                y: 1
            },
            {
                id: '4',
                label: 'Denmark',
                x: 3,
                y: 7
            }
        ]
    ]

    const [dataInd, setDataInd] = useState(1);
    const data = datas[dataInd % 2];
    const xDomain: [number, number] = [0, d3.max(data, d => d.x) ?? 0];
    const yDomain: [number, number] = [d3.max(data, d => d.y) ?? 0, 0];

    return (
        <React.Fragment>
            <div
                style={{
                    padding: 40
                }}
            >
                <ScatterPlot
                    xDomain={xDomain}
                    yDomain={yDomain}
                    data={data}
                />
            </div>

            <button
                onClick={() => {
                    setDataInd(dataInd + 1)
                }}
            >
                Swap data
            </button>
        </React.Fragment>
    )
}

export default App;
