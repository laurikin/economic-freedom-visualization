import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { loadData } from './loadData';

ReactDOM.render(
    <React.StrictMode>
        <div
            className="loader"
        >
            Loading Visualization
        </div>
    </React.StrictMode>,
    document.getElementById('root')
);

const init = async () => {

    const data = await loadData('data/data.csv')

    ReactDOM.render(
        <React.StrictMode>
            <App
                data={data}
            />
        </React.StrictMode>,
        document.getElementById('root')
    );
}

init();
