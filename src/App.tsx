import React, { useState } from 'react';
import { ScatterPlot } from './ScatterPlot';
import { datas, years } from './data';

const App = () => {

    const [dataInd, setDataInd] = useState(0)

    const data = datas[dataInd % years.length]
    const xDomain: [number, number] = [0, 10]
    const yDomain: [number, number] = [10, 0]

    return (
        <React.Fragment>
            <div
                style={{
                    padding: 40,
                    maxWidth: 800
                }}
            >
                <ScatterPlot
                    xDomain={xDomain}
                    yDomain={yDomain}
                    data={data}
                />

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
