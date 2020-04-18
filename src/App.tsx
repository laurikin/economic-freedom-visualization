import React, { useState } from 'react';
import { ScatterPlot, IScatterPlotData } from './ScatterPlot';

const App = () => {

    const datas: IScatterPlotData[] = [
        [
            {
                id: '1',
                x: 0,
                y: 0
            },
            {
                id: '2',
                x: 3,
                y: 2
            },
            {
                id: '3',
                x: 4,
                y: 6
            },
            {
                id: '4',
                x: 10,
                y: 10
            }
        ],

        [
            {
                id: '1',
                x: 1,
                y: 0
            },
            {
                id: '2',
                x: 4,
                y: 2
            },
            {
                id: '3',
                x: 3,
                y: 1
            },
            {
                id: '4',
                x: 3,
                y: 7
            }
        ]
    ]

    const [dataInd, setDataInd] = useState(1);
    const data = datas[dataInd % 2];

    console.log(dataInd);
    console.log(dataInd % 2);
    console.log(JSON.stringify(data));

    return (
        <React.Fragment>
            <div
                style={{
                    padding: 40
                }}
            >
                <ScatterPlot data={data} />
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
